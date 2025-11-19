import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoriaDto {
    @IsString()
    @IsOptional()
    nombre?: string;
}