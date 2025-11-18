import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';
import { ProductoImagen } from '../imagenes/entities/producto-imagen.entity';

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

    @Column({ type: 'varchar', length: 500, nullable: true })
    imagenUrl: string;

    @Column({ type: 'int' })
    categoriaId: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos)
    @JoinColumn({ name: 'categoriaId' })
    categoria: Categoria;

    @OneToMany(() => ProductoImagen, (imagen) => imagen.producto, { cascade: true })
    imagenes: ProductoImagen[];

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
