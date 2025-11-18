import { IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

export class UploadImagenesDto {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Min(0, { each: true })
    @Max(100, { each: true })
    ordenes?: number[];
}

export class UpdateOrdenImagenDto {
    @IsNumber()
    @Min(0)
    @Max(100)
    orden: number;
}