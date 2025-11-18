import { IsString } from 'class-validator';

export class ConfirmarPagoDto {
    @IsString()
    token: string;
}
