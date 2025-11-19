import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsNumber()
    @Min(0)
    precio: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsNumber()
    categoriaId: number;

    @IsString()
    @IsOptional()
    tamano?: string;

    @IsUrl()
    @IsOptional()
    imagenUrl?: string;

    @IsBoolean()
    @IsOptional()
    ofertaActiva?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    precioOferta?: number;

    @IsBoolean()
    @IsOptional()
    esDestacado?: boolean;
}