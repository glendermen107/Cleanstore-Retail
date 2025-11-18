import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'varchar', length: 100 })
    tamano: string;

    @Column({ type: 'varchar', length: 500 })
    imagenUrl: string;

    @Column({ type: 'int' })
    categoriaId: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos)
    @JoinColumn({ name: 'categoriaId' })
    categoria: Categoria;

    @Column({ type: 'boolean', default: false })
    ofertaActiva: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    precioOferta: number;

    @Column({ type: 'boolean', default: false })
    esDestacado: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
