import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../productos/producto.entity';
import { Categoria } from '../../categorias/categoria.entity';
import { PedidoItem } from '../../pedidos/entities/pedido-item.entity';
import { ProductoImagen } from '../../imagenes/entities/producto-imagen.entity';
import { ImagenesService } from '../../imagenes/imagenes.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

export interface ProductoWithStats extends Producto {
    totalVentas: number;
    ingresosTotales: number;
}

export interface TopProducto {
    id: string;
    nombre: string;
    totalVendido: number;
    ingresosTotales: number;
    categoria: string;
}

@Injectable()
export class AdminProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @InjectRepository(PedidoItem)
        private readonly pedidoItemRepository: Repository<PedidoItem>,
        @InjectRepository(ProductoImagen)
        private readonly productoImagenRepository: Repository<ProductoImagen>,
        private readonly imagenesService: ImagenesService,
    ) { }

    async create(createProductoDto: CreateProductoDto): Promise<Producto> {
        // Validate category existence
        const categoria = await this.categoriaRepository.findOne({
            where: { id: createProductoDto.categoriaId }
        });

        if (!categoria) {
            throw new BadRequestException(`Categoría con ID ${createProductoDto.categoriaId} no encontrada`);
        }

        try {
            // Create product
            const producto = this.productoRepository.create(createProductoDto);
            const savedProducto = await this.productoRepository.save(producto);

            // Return product with relationships
            const productWithRelations = await this.productoRepository.findOne({
                where: { id: savedProducto.id },
                relations: ['categoria', 'imagenes']
            });

            if (!productWithRelations) {
                throw new BadRequestException('Error recuperando el producto creado');
            }

            return productWithRelations;
        } catch (error) {
            throw new BadRequestException(`Error creando producto: ${error.message}`);
        }
    }

    async findAll(): Promise<ProductoWithStats[]> {
        const productos = await this.productoRepository
            .createQueryBuilder('producto')
            .leftJoinAndSelect('producto.categoria', 'categoria')
            .leftJoinAndSelect('producto.imagenes', 'imagenes')
            .leftJoin('pedido_items', 'pedidoItem', 'pedidoItem.productoId = producto.id')
            .leftJoin('pedidos', 'pedido', 'pedido.id = pedidoItem.pedidoId')
            .select([
                'producto',
                'categoria',
                'imagenes',
                'COALESCE(SUM(pedidoItem.cantidad), 0) as totalVentas',
                'COALESCE(SUM(pedidoItem.subtotal), 0) as ingresosTotales'
            ])
            .groupBy('producto.id')
            .addGroupBy('categoria.id')
            .addGroupBy('imagenes.id')
            .orderBy('imagenes.orden', 'ASC')
            .addOrderBy('imagenes.createdAt', 'ASC')
            .getRawAndEntities();

        // Process results to include statistics
        const productosWithStats: ProductoWithStats[] = productos.entities.map((producto, index) => {
            const raw = productos.raw[index];
            return {
                ...producto,
                totalVentas: parseInt(raw.totalVentas) || 0,
                ingresosTotales: parseFloat(raw.ingresosTotales) || 0
            };
        });

        return productosWithStats;
    }

    async findOne(id: string): Promise<Producto> {
        const producto = await this.productoRepository.findOne({
            where: { id },
            relations: ['categoria', 'imagenes']
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Order images by orden field
        if (producto.imagenes) {
            producto.imagenes.sort((a, b) => a.orden - b.orden);
        }

        return producto;
    }

    async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.productoRepository.findOne({
            where: { id }
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Validate category change if categoriaId is updated
        if (updateProductoDto.categoriaId && updateProductoDto.categoriaId !== producto.categoriaId) {
            const categoria = await this.categoriaRepository.findOne({
                where: { id: updateProductoDto.categoriaId }
            });

            if (!categoria) {
                throw new BadRequestException(`Categoría con ID ${updateProductoDto.categoriaId} no encontrada`);
            }
        }

        try {
            // Update only provided fields
            Object.assign(producto, updateProductoDto);
            const updatedProducto = await this.productoRepository.save(producto);

            // Return updated product with relationships
            const updatedProductWithRelations = await this.productoRepository.findOne({
                where: { id: updatedProducto.id },
                relations: ['categoria', 'imagenes']
            });

            if (!updatedProductWithRelations) {
                throw new BadRequestException('Error recuperando el producto actualizado');
            }

            return updatedProductWithRelations;
        } catch (error) {
            throw new BadRequestException(`Error actualizando producto: ${error.message}`);
        }
    }

    async remove(id: string): Promise<void> {
        const producto = await this.productoRepository.findOne({
            where: { id }
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Check for existing sales records
        const salesCount = await this.pedidoItemRepository.count({
            where: { productoId: id }
        });

        if (salesCount > 0) {
            throw new BadRequestException(
                `No se puede eliminar el producto porque tiene ${salesCount} registro(s) de venta asociado(s)`
            );
        }

        try {
            // Delete associated images through ImagenesService
            await this.imagenesService.deleteAllImagenesByProducto(id);

            // Delete product
            await this.productoRepository.remove(producto);
        } catch (error) {
            throw new BadRequestException(`Error eliminando producto: ${error.message}`);
        }
    }

    async getTopProductos(limit: number = 10): Promise<TopProducto[]> {
        const topProductos = await this.productoRepository
            .createQueryBuilder('producto')
            .leftJoin('pedido_items', 'pedidoItem', 'pedidoItem.productoId = producto.id')
            .leftJoin('pedidos', 'pedido', 'pedido.id = pedidoItem.pedidoId')
            .leftJoin('producto.categoria', 'categoria')
            .select([
                'producto.id as id',
                'producto.nombre as nombre',
                'categoria.nombre as categoria',
                'COALESCE(SUM(pedidoItem.cantidad), 0) as totalVendido',
                'COALESCE(SUM(pedidoItem.subtotal), 0) as ingresosTotales'
            ])
            .groupBy('producto.id')
            .addGroupBy('categoria.id')
            .orderBy('totalVendido', 'DESC')
            .addOrderBy('ingresosTotales', 'DESC')
            .limit(limit)
            .getRawMany();

        return topProductos.map(item => ({
            id: item.id,
            nombre: item.nombre,
            categoria: item.categoria || 'Sin categoría',
            totalVendido: parseInt(item.totalVendido) || 0,
            ingresosTotales: parseFloat(item.ingresosTotales) || 0
        }));
    }
}