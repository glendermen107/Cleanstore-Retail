import { IsString, IsNumber, Min } from 'class-validator';

export class CreatePagoDto {
    @IsString()
    pedidoId: string;

    @IsNumber()
    @Min(1)
    monto: number;
}
