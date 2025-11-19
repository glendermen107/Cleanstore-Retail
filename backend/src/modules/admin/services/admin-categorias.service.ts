import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../categorias/categoria.entity';
import { Producto } from '../../productos/producto.entity';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class AdminCategoriasService {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) { }

    /**
     * Create a new category
     * Requirements: 2.1
     */
    async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
        try {
            const categoria = this.categoriaRepository.create(createCategoriaDto);
            return await this.categoriaRepository.save(categoria);
        } catch (error) {
            throw new BadRequestException('Error creating category: ' + error.message);
        }
    }

    /**
     * Update an existing category
     * Requirements: 2.3
     */
    async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });

        if (!categoria) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        try {
            Object.assign(categoria, updateCategoriaDto);
            return await this.categoriaRepository.save(categoria);
        } catch (error) {
            throw new BadRequestException('Error updating category: ' + error.message);
        }
    }

    /**
     * Get all categories with product count statistics
     * Requirements: 2.2, 6.1
     */
    async findAll(): Promise<any[]> {
        const categories = await this.categoriaRepository
            .createQueryBuilder('categoria')
            .leftJoin('categoria.productos', 'producto')
            .select([
                'categoria.id',
                'categoria.nombre',
                'COUNT(producto.id) as totalProductos'
            ])
            .groupBy('categoria.id, categoria.nombre')
            .orderBy('categoria.nombre', 'ASC')
            .getRawMany();

        return categories.map(category => ({
            id: category.categoria_id,
            nombre: category.categoria_nombre,
            totalProductos: parseInt(category.totalProductos) || 0
        }));
    }

    /**
     * Get category details with associated products
     * Requirements: 2.2
     */
    async findOne(id: number): Promise<any> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });

        if (!categoria) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Get associated products with limited fields
        const productos = await this.productoRepository
            .createQueryBuilder('producto')
            .select([
                'producto.id',
                'producto.nombre',
                'producto.precio',
                'producto.stock'
            ])
            .where('producto.categoriaId = :categoriaId', { categoriaId: id })
            .orderBy('producto.nombre', 'ASC')
            .getMany();

        return {
            id: categoria.id,
            nombre: categoria.nombre,
            totalProductos: productos.length,
            productos: productos
        };
    }

    /**
     * Safely delete a category after checking for associated products
     * Requirements: 2.4, 2.5, 5.2
     */
    async remove(id: number): Promise<void> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });

        if (!categoria) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check for associated products
        const productCount = await this.productoRepository.count({
            where: { categoriaId: id }
        });

        if (productCount > 0) {
            throw new BadRequestException(
                `Cannot delete category. It has ${productCount} associated product(s). Please remove or reassign the products first.`
            );
        }

        try {
            await this.categoriaRepository.remove(categoria);
        } catch (error) {
            throw new BadRequestException('Error deleting category: ' + error.message);
        }
    }
}