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

    @IsString()
    @IsOptional()
    tamano?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    imagenUrl?: string;

    @IsNumber()
    @IsOptional()
    categoriaId?: number;

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
