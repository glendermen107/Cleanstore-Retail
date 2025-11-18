import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { Producto } from '../productos/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        @InjectRepository(PedidoItem)
        private readonly pedidoItemRepository: Repository<PedidoItem>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Crear el pedido
            const pedido = this.pedidoRepository.create({
                nombreCliente: createPedidoDto.nombreCliente,
                email: createPedidoDto.email,
                telefono: createPedidoDto.telefono,
                direccion: createPedidoDto.direccion,
                comuna: createPedidoDto.comuna,
                notas: createPedidoDto.notas,
                total: 0,
            });

            const savedPedido = await queryRunner.manager.save(pedido);

            // Crear los items y calcular el total
            let total = 0;
            const items: PedidoItem[] = [];

            for (const itemDto of createPedidoDto.items) {
                const producto = await this.productoRepository.findOne({
                    where: { id: itemDto.productoId },
                });

                if (!producto) {
                    throw new BadRequestException(`Producto con ID ${itemDto.productoId} no encontrado`);
                }

                const precioUnitario = producto.ofertaActiva && producto.precioOferta
                    ? producto.precioOferta
                    : producto.precio;

                const subtotal = Number(precioUnitario) * itemDto.cantidad;

                const item = this.pedidoItemRepository.create({
                    pedidoId: savedPedido.id,
                    productoId: producto.id,
                    cantidad: itemDto.cantidad,
                    precioUnitario: precioUnitario,
                    subtotal: subtotal,
                });

                const savedItem = await queryRunner.manager.save(item);
                items.push(savedItem);
                total += subtotal;
            }

            // Actualizar el total del pedido
            savedPedido.total = total;
            await queryRunner.manager.save(savedPedido);

            await queryRunner.commitTransaction();

            // Retornar el pedido con sus items
            return this.findOne(savedPedido.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<Pedido[]> {
        return await this.pedidoRepository.find({
            relations: ['items', 'items.producto'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Pedido> {
        const pedido = await this.pedidoRepository.findOne({
            where: { id },
            relations: ['items', 'items.producto'],
        });

        if (!pedido) {
            throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
        }

        return pedido;
    }

    async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
        const pedido = await this.findOne(id);
        Object.assign(pedido, updatePedidoDto);
        await this.pedidoRepository.save(pedido);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const pedido = await this.findOne(id);
        await this.pedidoRepository.remove(pedido);
    }
}
