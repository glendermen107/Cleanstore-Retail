import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/producto.entity';

@Entity('pedido_items')
export class PedidoItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'uuid' })
    productoId: string;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'productoId' })
    producto: Producto;

    @Column({ type: 'uuid' })
    pedidoId: string;

    @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pedidoId' })
    pedido: Pedido;
}
