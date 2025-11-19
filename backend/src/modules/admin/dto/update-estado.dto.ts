import { IsString, IsIn } from 'class-validator';

export class UpdateEstadoDto {
    @IsString()
    @IsIn(['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'])
    estado: string;
}