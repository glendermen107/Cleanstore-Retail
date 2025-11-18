import { IsString, IsOptional } from 'class-validator';

export class UpdatePedidoDto {
    @IsString()
    @IsOptional()
    estado?: string;

    @IsString()
    @IsOptional()
    notas?: string;
}
