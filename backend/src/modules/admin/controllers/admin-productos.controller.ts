import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
    ParseIntPipe,
    ValidationPipe
} from '@nestjs/common';
import { AdminProductosService } from '../services/admin-productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Controller('admin/productos')
export class AdminProductosController {
    constructor(private readonly adminProductosService: AdminProductosService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body(ValidationPipe) createProductoDto: CreateProductoDto) {
        return await this.adminProductosService.create(createProductoDto);
    }

    @Get()
    async findAll() {
        return await this.adminProductosService.findAll();
    }

    @Get('top/:limit')
    async getTopProductos(@Param('limit', ParseIntPipe) limit: number) {
        return await this.adminProductosService.getTopProductos(limit);
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.adminProductosService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateProductoDto: UpdateProductoDto
    ) {
        return await this.adminProductosService.update(id, updateProductoDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.adminProductosService.remove(id);
    }
}