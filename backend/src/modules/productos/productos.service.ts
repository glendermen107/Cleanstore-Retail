import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) { }

    async create(createProductoDto: CreateProductoDto): Promise<Producto> {
        const producto = this.productoRepository.create(createProductoDto);
        return await this.productoRepository.save(producto);
    }

    async findAll(): Promise<Producto[]> {
        return await this.productoRepository.find({
            relations: ['categoria', 'imagenes'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Producto> {
        const producto = await this.productoRepository.findOne({
            where: { id },
            relations: ['categoria', 'imagenes'],
        });
        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Ordenar imágenes por orden y fecha de creación
        if (producto.imagenes) {
            producto.imagenes.sort((a, b) => {
                if (a.orden !== b.orden) {
                    return a.orden - b.orden;
                }
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        }

        return producto;
    }

    async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOne(id);
        Object.assign(producto, updateProductoDto);
        return await this.productoRepository.save(producto);
    }

    async remove(id: string): Promise<void> {
        const producto = await this.findOne(id);
        await this.productoRepository.remove(producto);
    }
}
