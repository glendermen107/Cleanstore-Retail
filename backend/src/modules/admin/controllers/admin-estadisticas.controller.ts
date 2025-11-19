import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AdminEstadisticasService, DashboardSummary, VentasDiarias } from '../services/admin-estadisticas.service';

@Controller('admin/estadisticas')
export class AdminEstadisticasController {
    constructor(private readonly adminEstadisticasService: AdminEstadisticasService) { }

    @Get('resumen')
    async getResumen(): Promise<DashboardSummary> {
        return await this.adminEstadisticasService.getResumen();
    }

    @Get('ventas-por-dia')
    async getVentasPorDia(
        @Query('dias', new ParseIntPipe({ optional: true })) dias?: number
    ): Promise<VentasDiarias[]> {
        return await this.adminEstadisticasService.getVentasPorDia(dias);
    }
}