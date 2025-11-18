import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoImagen } from './entities/producto-imagen.entity';
import { Producto } from '../productos/producto.entity';
import { MinioService } from './services/minio.service';
import { UploadImagenesDto, UpdateOrdenImagenDto } from './dto/upload-imagenes.dto';

@Injectable()
export class ImagenesService {
    constructor(
        @InjectRepository(ProductoImagen)
        private readonly imagenRepository: Repository<ProductoImagen>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        private readonly minioService: MinioService,
    ) { }

    async uploadImagenes(
        productoId: string,
        files: Express.Multer.File[],
        uploadDto?: UploadImagenesDto,
    ): Promise<ProductoImagen[]> {
        // Verificar que el producto existe
        const producto = await this.productoRepository.findOne({
            where: { id: productoId },
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
        }

        // Validar archivos
        this.validateFiles(files);

        // Obtener el siguiente orden disponible
        const maxOrden = await this.imagenRepository
            .createQueryBuilder('imagen')
            .where('imagen.productoId = :productoId', { productoId })
            .select('MAX(imagen.orden)', 'maxOrden')
            .getRawOne();

        let nextOrden = (maxOrden?.maxOrden || 0) + 1;

        const imagenesCreadas: ProductoImagen[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // Subir imagen a MinIO
                const { filename, url } = await this.minioService.uploadProductImage(
                    productoId,
                    file,
                );

                // Determinar orden
                const orden = uploadDto?.ordenes?.[i] ?? nextOrden++;

                // Crear registro en base de datos
                const imagen = this.imagenRepository.create({
                    productoId,
                    url,
                    filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    orden,
                });

                const imagenGuardada = await this.imagenRepository.save(imagen);
                imagenesCreadas.push(imagenGuardada);
            } catch (error) {
                // Si falla, limpiar imágenes ya subidas
                await this.cleanupFailedUploads(imagenesCreadas);
                throw new BadRequestException(`Error subiendo imagen ${file.originalname}: ${error.message}`);
            }
        }

        return imagenesCreadas;
    }

    async getImagenesByProducto(productoId: string): Promise<ProductoImagen[]> {
        const producto = await this.productoRepository.findOne({
            where: { id: productoId },
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
        }

        return await this.imagenRepository.find({
            where: { productoId },
            order: { orden: 'ASC', createdAt: 'ASC' },
        });
    }

    async deleteImagen(productoId: string, imagenId: string): Promise<void> {
        const imagen = await this.imagenRepository.findOne({
            where: { id: imagenId, productoId },
        });

        if (!imagen) {
            throw new NotFoundException(`Imagen con ID ${imagenId} no encontrada para el producto ${productoId}`);
        }

        try {
            // Eliminar de MinIO
            await this.minioService.removeImage(imagen.filename);

            // Eliminar de base de datos
            await this.imagenRepository.remove(imagen);
        } catch (error) {
            throw new BadRequestException(`Error eliminando imagen: ${error.message}`);
        }
    }

    async updateOrdenImagen(
        productoId: string,
        imagenId: string,
        updateDto: UpdateOrdenImagenDto,
    ): Promise<ProductoImagen> {
        const imagen = await this.imagenRepository.findOne({
            where: { id: imagenId, productoId },
        });

        if (!imagen) {
            throw new NotFoundException(`Imagen con ID ${imagenId} no encontrada para el producto ${productoId}`);
        }

        imagen.orden = updateDto.orden;
        return await this.imagenRepository.save(imagen);
    }

    async deleteAllImagenesByProducto(productoId: string): Promise<void> {
        const imagenes = await this.imagenRepository.find({
            where: { productoId },
        });

        for (const imagen of imagenes) {
            try {
                await this.minioService.removeImage(imagen.filename);
            } catch (error) {
                console.error(`Error eliminando imagen ${imagen.filename}:`, error);
            }
        }

        await this.imagenRepository.delete({ productoId });
    }

    private validateFiles(files: Express.Multer.File[]): void {
        if (!files || files.length === 0) {
            throw new BadRequestException('No se proporcionaron archivos');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        const maxFiles = 10;

        if (files.length > maxFiles) {
            throw new BadRequestException(`Máximo ${maxFiles} archivos permitidos`);
        }

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException(
                    `Tipo de archivo no permitido: ${file.mimetype}. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
                );
            }

            if (file.size > maxFileSize) {
                throw new BadRequestException(
                    `Archivo ${file.originalname} excede el tamaño máximo de 5MB`,
                );
            }
        }
    }

    private async cleanupFailedUploads(imagenes: ProductoImagen[]): Promise<void> {
        for (const imagen of imagenes) {
            try {
                await this.minioService.removeImage(imagen.filename);
                await this.imagenRepository.remove(imagen);
            } catch (error) {
                console.error(`Error limpiando imagen fallida ${imagen.filename}:`, error);
            }
        }
    }
}