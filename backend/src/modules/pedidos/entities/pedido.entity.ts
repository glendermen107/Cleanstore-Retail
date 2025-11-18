import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PedidoItem } from './pedido-item.entity';
import { Pago } from '../../pagos/pago.entity';

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    nombreCliente: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 50 })
    telefono: string;

    @Column({ type: 'text' })
    direccion: string;

    @Column({ type: 'varchar', length: 100 })
    comuna: string;

    @Column({ type: 'text', nullable: true })
    notas: string;

    @Column({ type: 'varchar', length: 50, default: 'pendiente' })
    estado: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @OneToMany(() => PedidoItem, (item) => item.pedido, { cascade: true })
    items: PedidoItem[];

    @OneToMany(() => Pago, (pago) => pago.pedido)
    pagos: Pago[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
