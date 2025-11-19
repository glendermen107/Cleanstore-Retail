import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, ParseIntPipe } from '@nestjs/common';
import { AdminCategoriasService } from '../services/admin-categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Controller('admin/categorias')
export class AdminCategoriasController {
    constructor(private readonly adminCategoriasService: AdminCategoriasService) { }

    /**
     * Create a new category
     * POST /admin/categorias
     * Requirements: 2.1
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCategoriaDto: CreateCategoriaDto) {
        return await this.adminCategoriasService.create(createCategoriaDto);
    }

    /**
     * Get all categories with product statistics
     * GET /admin/categorias
     * Requirements: 2.2
     */
    @Get()
    async findAll() {
        return await this.adminCategoriasService.findAll();
    }

    /**
     * Get category details with associated products
     * GET /admin/categorias/:id
     * Requirements: 2.2
     */
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.adminCategoriasService.findOne(id);
    }

    /**
     * Update an existing category
     * PUT /admin/categorias/:id
     * Requirements: 2.3
     */
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoriaDto: UpdateCategoriaDto
    ) {
        return await this.adminCategoriasService.update(id, updateCategoriaDto);
    }

    /**
     * Delete a category with safety checks
     * DELETE /admin/categorias/:id
     * Requirements: 2.4, 2.5
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.adminCategoriasService.remove(id);
    }
}