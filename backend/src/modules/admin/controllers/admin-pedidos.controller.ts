import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { AdminPedidosService, PedidoSummary, PedidoDetallado, EstadisticasPedidos } from '../services/admin-pedidos.service';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { UpdateEstadoDto } from '../dto/update-estado.dto';

@Controller('admin/pedidos')
export class AdminPedidosController {
    constructor(private readonly adminPedidosService: AdminPedidosService) { }

    /**
     * GET /admin/pedidos
     * Return order list with summary information
     * Include customer and status data
     * Requirements: 3.1
     */
    @Get()
    async findAll(): Promise<PedidoSummary[]> {
        return await this.adminPedidosService.findAll();
    }

    /**
     * GET /admin/pedidos/estadisticas
     * Return order statistics by status
     * Format for dashboard analytics
     * Requirements: 3.5
     */
    @Get('estadisticas')
    async getEstadisticas(): Promise<EstadisticasPedidos[]> {
        return await this.adminPedidosService.getEstadisticasPedidos();
    }

    /**
     * GET /admin/pedidos/:id
     * Return detailed order information
     * Include items, products, and payment data
     * Requirements: 3.2
     */
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PedidoDetallado> {
        return await this.adminPedidosService.findOne(id);
    }

    /**
     * PATCH /admin/pedidos/:id/estado
     * Accept estado in request body
     * Update order status with validation
     * Requirements: 3.1
     */
    @Patch(':id/estado')
    @HttpCode(HttpStatus.OK)
    async updateEstado(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEstadoDto: UpdateEstadoDto
    ): Promise<Pedido> {
        return await this.adminPedidosService.updateEstado(id, updateEstadoDto.estado);
    }
}