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

    @IsString()
    tamano: string;

    @IsString()
    @IsUrl()
    imagenUrl: string;

    @IsNumber()
    categoriaId: number;

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
