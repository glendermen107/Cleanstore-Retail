import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/producto.entity';

@Entity('producto_imagenes')
export class ProductoImagen {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    productoId: string;

    @ManyToOne(() => Producto, (producto) => producto.imagenes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productoId' })
    producto: Producto;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'varchar', length: 255 })
    filename: string;

    @Column({ type: 'varchar', length: 100 })
    originalName: string;

    @Column({ type: 'varchar', length: 50 })
    mimeType: string;

    @Column({ type: 'int' })
    size: number;

    @Column({ type: 'int', default: 0 })
    orden: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}