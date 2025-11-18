import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';
import { ProductoImagen } from '../imagenes/entities/producto-imagen.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Producto, ProductoImagen])],
    controllers: [ProductosController],
    providers: [ProductosService],
    exports: [ProductosService],
})
export class ProductosModule { }
