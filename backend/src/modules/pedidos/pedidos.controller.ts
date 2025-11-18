import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPedidoDto: CreatePedidoDto) {
        return this.pedidosService.create(createPedidoDto);
    }

    @Get()
    findAll() {
        return this.pedidosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pedidosService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
        return this.pedidosService.update(id, updatePedidoDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.pedidosService.remove(id);
    }
}
