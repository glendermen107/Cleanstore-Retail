import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCategoriaDto: CreateCategoriaDto) {
        return this.categoriasService.create(createCategoriaDto);
    }

    @Get()
    findAll() {
        return this.categoriasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriasService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
        return this.categoriasService.update(+id, updateCategoriaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.categoriasService.remove(+id);
    }
}
