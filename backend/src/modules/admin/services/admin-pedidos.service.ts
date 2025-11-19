import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { PedidoItem } from '../../pedidos/entities/pedido-item.entity';
import { Pago } from '../../pagos/pago.entity';

export interface PedidoSummary {
    id: string;
    nombreCliente: string;
    email: string;
    telefono: string;
    direccion: string;
    comuna: string;
    estado: string;
    total: number;
    totalItems: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PedidoDetallado {
    id: string;
    nombreCliente: string;
    email: string;
    telefono: string;
    direccion: string;
    comuna: string;
    notas: string;
    estado: string;
    total: number;
    items: {
        id: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
        producto: {
            id: string;
            nombre: string;
            categoria: {
                id: number;
                nombre: string;
            };
        };
    }[];
    pagos: {
        id: string;
        monto: number;
        estado: string;
        metodoPago: string;
        fechaTransaccion: Date;
        codigoAutorizacion: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface EstadisticasPedidos {
    estado: string;
    count: number;
    totalAmount: number;
}

@Injectable()
export class AdminPedidosService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        @InjectRepository(PedidoItem)
        private readonly pedidoItemRepository: Repository<PedidoItem>,
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
    ) { }

    /**
     * Fetch all orders with customer information and status
     * Calculate totalItems count per order using QueryBuilder
     * Order by creation date (newest first)
     * Return paginated results optimized for admin table display
     */
    async findAll(): Promise<PedidoSummary[]> {
        const pedidos = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .leftJoin('pedido.items', 'items')
            .select([
                'pedido.id',
                'pedido.nombreCliente',
                'pedido.email',
                'pedido.telefono',
                'pedido.direccion',
                'pedido.comuna',
                'pedido.estado',
                'pedido.total',
                'pedido.createdAt',
                'pedido.updatedAt',
                'COUNT(items.id) as totalItems'
            ])
            .groupBy('pedido.id')
            .orderBy('pedido.createdAt', 'DESC')
            .getRawMany();

        return pedidos.map(pedido => ({
            id: pedido.pedido_id,
            nombreCliente: pedido.pedido_nombreCliente,
            email: pedido.pedido_email,
            telefono: pedido.pedido_telefono,
            direccion: pedido.pedido_direccion,
            comuna: pedido.pedido_comuna,
            estado: pedido.pedido_estado,
            total: parseFloat(pedido.pedido_total),
            totalItems: parseInt(pedido.totalItems),
            createdAt: pedido.pedido_createdAt,
            updatedAt: pedido.pedido_updatedAt,
        }));
    }

    /**
     * Fetch complete order with items, productos, categorias relationships
     * Include payment information from pagos table
     * Format items with product and category details
     * Handle not found scenarios appropriately
     */
    async findOne(id: string): Promise<PedidoDetallado> {
        const pedido = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.items', 'items')
            .leftJoinAndSelect('items.producto', 'producto')
            .leftJoinAndSelect('producto.categoria', 'categoria')
            .leftJoinAndSelect('pedido.pagos', 'pagos')
            .where('pedido.id = :id', { id })
            .getOne();

        if (!pedido) {
            throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
        }

        return {
            id: pedido.id,
            nombreCliente: pedido.nombreCliente,
            email: pedido.email,
            telefono: pedido.telefono,
            direccion: pedido.direccion,
            comuna: pedido.comuna,
            notas: pedido.notas,
            estado: pedido.estado,
            total: pedido.total,
            items: pedido.items.map(item => ({
                id: item.id,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subtotal: item.subtotal,
                producto: {
                    id: item.producto.id,
                    nombre: item.producto.nombre,
                    categoria: {
                        id: item.producto.categoria.id,
                        nombre: item.producto.categoria.nombre,
                    },
                },
            })),
            pagos: pedido.pagos.map(pago => ({
                id: pago.id,
                monto: pago.monto,
                estado: pago.estado,
                metodoPago: pago.metodoPago,
                fechaTransaccion: pago.fechaTransaccion,
                codigoAutorizacion: pago.codigoAutorizacion,
            })),
            createdAt: pedido.createdAt,
            updatedAt: pedido.updatedAt,
        };
    }

    /**
     * Validate order existence before status update
     * Update order estado field with audit trail
     * Return updated order information
     */
    async updateEstado(id: string, estado: string): Promise<Pedido> {
        const pedido = await this.pedidoRepository.findOne({
            where: { id },
        });

        if (!pedido) {
            throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
        }

        // Validate estado values (you can extend this with more specific validation)
        const validEstados = ['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'];
        if (!validEstados.includes(estado)) {
            throw new Error(`Estado '${estado}' no es válido. Estados válidos: ${validEstados.join(', ')}`);
        }

        pedido.estado = estado;
        pedido.updatedAt = new Date();

        return await this.pedidoRepository.save(pedido);
    }

    /**
     * Group orders by estado with counts and total amounts
     * Calculate statistics for dashboard consumption
     * Return formatted data for status-based analytics
     */
    async getEstadisticasPedidos(): Promise<EstadisticasPedidos[]> {
        const estadisticas = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .select([
                'pedido.estado as estado',
                'COUNT(pedido.id) as count',
                'COALESCE(SUM(pedido.total), 0) as totalAmount'
            ])
            .groupBy('pedido.estado')
            .orderBy('pedido.estado', 'ASC')
            .getRawMany();

        return estadisticas.map(stat => ({
            estado: stat.estado,
            count: parseInt(stat.count),
            totalAmount: parseFloat(stat.totalAmount),
        }));
    }
}