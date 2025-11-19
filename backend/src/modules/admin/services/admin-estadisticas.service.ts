import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../productos/producto.entity';
import { Categoria } from '../../categorias/categoria.entity';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { PedidoItem } from '../../pedidos/entities/pedido-item.entity';

export interface DashboardSummary {
    totalProductos: number;
    totalCategorias: number;
    totalPedidos: number;
    pedidosHoy: number;
    ventasHoy: number;
    ventasPorMes: VentasMensuales[];
    topProductos: TopProducto[];
}

export interface VentasDiarias {
    fecha: string;
    totalVentas: number;
    totalPedidos: number;
}

export interface VentasMensuales {
    mes: string;
    año: number;
    totalVentas: number;
    totalPedidos: number;
}

export interface TopProducto {
    id: string;
    nombre: string;
    totalVendido: number;
    ingresosTotales: number;
    categoria: string;
}

@Injectable()
export class AdminEstadisticasService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        @InjectRepository(PedidoItem)
        private readonly pedidoItemRepository: Repository<PedidoItem>,
    ) { }

    async getResumen(): Promise<DashboardSummary> {
        // Calculate basic counts
        const totalProductos = await this.productoRepository.count();
        const totalCategorias = await this.categoriaRepository.count();
        const totalPedidos = await this.pedidoRepository.count();

        // Calculate today's metrics
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const pedidosHoy = await this.pedidoRepository.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay
                } as any
            }
        });

        const ventasHoyResult = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .select('COALESCE(SUM(pedido.total), 0)', 'ventasHoy')
            .where('pedido.createdAt >= :startOfDay', { startOfDay })
            .andWhere('pedido.createdAt < :endOfDay', { endOfDay })
            .getRawOne();

        const ventasHoy = parseFloat(ventasHoyResult?.ventasHoy) || 0;

        // Get monthly sales data and top products
        const [ventasPorMes, topProductos] = await Promise.all([
            this.getVentasPorMes(),
            this.getTopProductos(5)
        ]);

        return {
            totalProductos,
            totalCategorias,
            totalPedidos,
            pedidosHoy,
            ventasHoy,
            ventasPorMes,
            topProductos
        };
    }

    async getVentasPorDia(dias: number = 30): Promise<VentasDiarias[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - dias);

        const ventasDiarias = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .select([
                'DATE(pedido.createdAt) as fecha',
                'COALESCE(SUM(pedido.total), 0) as totalVentas',
                'COUNT(pedido.id) as totalPedidos'
            ])
            .where('pedido.createdAt >= :startDate', { startDate })
            .andWhere('pedido.createdAt <= :endDate', { endDate })
            .groupBy('DATE(pedido.createdAt)')
            .orderBy('fecha', 'ASC')
            .getRawMany();

        return ventasDiarias.map(item => ({
            fecha: item.fecha,
            totalVentas: parseFloat(item.totalVentas) || 0,
            totalPedidos: parseInt(item.totalPedidos) || 0
        }));
    }

    async getVentasPorMes(): Promise<VentasMensuales[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);

        const ventasMensuales = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .select([
                'EXTRACT(YEAR FROM pedido.createdAt) as año',
                'EXTRACT(MONTH FROM pedido.createdAt) as mesNumero',
                'COALESCE(SUM(pedido.total), 0) as totalVentas',
                'COUNT(pedido.id) as totalPedidos'
            ])
            .where('pedido.createdAt >= :startDate', { startDate })
            .andWhere('pedido.createdAt <= :endDate', { endDate })
            .groupBy('EXTRACT(YEAR FROM pedido.createdAt)')
            .addGroupBy('EXTRACT(MONTH FROM pedido.createdAt)')
            .orderBy('año', 'ASC')
            .addOrderBy('mesNumero', 'ASC')
            .getRawMany();

        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        return ventasMensuales.map(item => ({
            mes: meses[parseInt(item.mesNumero) - 1],
            año: parseInt(item.año),
            totalVentas: parseFloat(item.totalVentas) || 0,
            totalPedidos: parseInt(item.totalPedidos) || 0
        }));
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