import { IsString, IsEmail, IsArray, ValidateNested, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePedidoItemDto } from './create-pedido-item.dto';

export class CreatePedidoDto {
    @IsString()
    nombreCliente: string;

    @IsEmail()
    email: string;

    @IsString()
    telefono: string;

    @IsString()
    direccion: string;

    @IsString()
    comuna: string;

    @IsString()
    @IsOptional()
    notas?: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatePedidoItemDto)
    items: CreatePedidoItemDto[];
}
