import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService implements OnModuleInit {
    private readonly logger = new Logger(MinioService.name);
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'cleanstore');

        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
            port: parseInt(this.configService.get<string>('MINIO_PORT', '9000')),
            useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'admin'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'password'),
        });
    }

    async onModuleInit() {
        await this.createBucketIfNotExists();
    }

    private async createBucketIfNotExists() {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                this.logger.log(`Bucket '${this.bucketName}' created successfully`);

                // Set bucket policy to public read
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };

                await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
                this.logger.log(`Bucket policy set to public read`);
            } else {
                this.logger.log(`Bucket '${this.bucketName}' already exists`);
            }
        } catch (error) {
            this.logger.error(`Error creating bucket: ${error.message}`);
            throw error;
        }
    }

    async uploadProductImage(
        productoId: string,
        file: Express.Multer.File,
    ): Promise<{ filename: string; url: string }> {
        try {
            const fileExtension = file.originalname.split('.').pop();
            const filename = `productos/${productoId}/${uuidv4()}.${fileExtension}`;

            await this.minioClient.putObject(
                this.bucketName,
                filename,
                file.buffer,
                file.size,
                {
                    'Content-Type': file.mimetype,
                    'Content-Disposition': `inline; filename="${file.originalname}"`,
                },
            );

            const url = this.getPublicUrl(filename);

            this.logger.log(`Image uploaded successfully: ${filename}`);
            return { filename, url };
        } catch (error) {
            this.logger.error(`Error uploading image: ${error.message}`);
            throw error;
        }
    }

    async removeImage(filename: string): Promise<void> {
        try {
            await this.minioClient.removeObject(this.bucketName, filename);
            this.logger.log(`Image removed successfully: ${filename}`);
        } catch (error) {
            this.logger.error(`Error removing image: ${error.message}`);
            throw error;
        }
    }

    getPublicUrl(filename: string): string {
        const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
        const port = this.configService.get<string>('MINIO_PORT', '9000');
        const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
        const protocol = useSSL ? 'https' : 'http';

        return `${protocol}://${endpoint}:${port}/${this.bucketName}/${filename}`;
    }

    async getPresignedUrl(filename: string, expiry: number = 7 * 24 * 60 * 60): Promise<string> {
        try {
            return await this.minioClient.presignedGetObject(this.bucketName, filename, expiry);
        } catch (error) {
            this.logger.error(`Error generating presigned URL: ${error.message}`);
            throw error;
        }
    }
}