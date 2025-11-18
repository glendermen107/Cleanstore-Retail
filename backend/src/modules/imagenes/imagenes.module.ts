import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImagenesController } from './imagenes.controller';
import { ImagenesService } from './imagenes.service';
import { MinioService } from './services/minio.service';
import { ProductoImagen } from './entities/producto-imagen.entity';
import { Producto } from '../productos/producto.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductoImagen, Producto]),
        ConfigModule,
    ],
    controllers: [ImagenesController],
    providers: [ImagenesService, MinioService],
    exports: [ImagenesService, MinioService],
})
export class ImagenesModule { }