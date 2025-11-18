import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../pedidos/entities/pedido.entity';

@Entity('pagos')
export class Pago {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    pedidoId: string;

    @ManyToOne(() => Pedido, (pedido) => pedido.pagos)
    @JoinColumn({ name: 'pedidoId' })
    pedido: Pedido;

    @Column({ type: 'varchar', length: 255 })
    token: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @Column({ type: 'varchar', length: 50, default: 'iniciado' })
    estado: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    codigoAutorizacion: string;

    @Column({ type: 'timestamp', nullable: true })
    fechaTransaccion: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    metodoPago: string;

    @Column({ type: 'jsonb', nullable: true })
    responseData: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
