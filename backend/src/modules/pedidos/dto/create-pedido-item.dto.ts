import { IsString, IsNumber, Min } from 'class-validator';

export class CreatePedidoItemDto {
    @IsString()
    productoId: string;

    @IsNumber()
    @Min(1)
    cantidad: number;
}
