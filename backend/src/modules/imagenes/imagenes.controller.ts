import {
    Controller,
    Post,
    Get,
    Delete,
    Patch,
    Param,
    Body,
    UploadedFiles,
    UseInterceptors,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagenesService } from './imagenes.service';
import { UploadImagenesDto, UpdateOrdenImagenDto } from './dto/upload-imagenes.dto';

@Controller('productos/:productoId/imagenes')
export class ImagenesController {
    constructor(private readonly imagenesService: ImagenesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files', 10, {
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
            }
        },
    }))
    async uploadImagenes(
        @Param('productoId', ParseUUIDPipe) productoId: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadDto?: UploadImagenesDto,
    ) {
        return await this.imagenesService.uploadImagenes(productoId, files, uploadDto);
    }

    @Get()
    async getImagenes(@Param('productoId', ParseUUIDPipe) productoId: string) {
        return await this.imagenesService.getImagenesByProducto(productoId);
    }

    @Delete(':imagenId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteImagen(
        @Param('productoId', ParseUUIDPipe) productoId: string,
        @Param('imagenId', ParseUUIDPipe) imagenId: string,
    ) {
        await this.imagenesService.deleteImagen(productoId, imagenId);
    }

    @Patch(':imagenId/orden')
    async updateOrdenImagen(
        @Param('productoId', ParseUUIDPipe) productoId: string,
        @Param('imagenId', ParseUUIDPipe) imagenId: string,
        @Body() updateDto: UpdateOrdenImagenDto,
    ) {
        return await this.imagenesService.updateOrdenImagen(productoId, imagenId, updateDto);
    }
}