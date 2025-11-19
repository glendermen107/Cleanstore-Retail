import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl, Min } from 'class-validator';

export class UpdateProductoDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    precio?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    stock?: number;

    @IsNumber()
    @IsOptional()
    categoriaId?: number;

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