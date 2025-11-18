import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Query, BadRequestException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) { }

    @Post('iniciar')
    @HttpCode(HttpStatus.CREATED)
    iniciar(@Body() createPagoDto: CreatePagoDto) {
        return this.pagosService.iniciarTransaccion(createPagoDto.pedidoId, createPagoDto.monto);
    }

    @Get('retorno')
    @HttpCode(HttpStatus.OK)
    async retornoWebpay(@Query('token_ws') token_ws: string) {
        console.log('Token recibido en retorno:', token_ws);
        if (!token_ws) {
            return {
                error: "token_ws_faltante_o_invalido",
                message: "El parámetro token_ws es requerido"
            };
        }

        try {
            return await this.pagosService.confirmarTransaccion(token_ws);
        } catch (error) {
            // If it's a NotFoundException, handle it gracefully
            if (error instanceof NotFoundException) {
                return {
                    error: "token_ws_no_encontrado",
                    message: error.message,
                    statusCode: 404
                };
            }

            // For other errors, return them in a structured way
            return {
                error: "error_procesando_pago",
                message: error.message,
                statusCode: 500
            };
        }
    }

    @Post('confirmar')
    @HttpCode(HttpStatus.OK)
    confirmarPost(@Body() confirmarPagoDto: ConfirmarPagoDto) {
        return this.pagosService.confirmarTransaccion(confirmarPagoDto.token);
    }

    @Get('detalle/:token')
    obtenerPago(@Param('token') token: string) {
        return this.pagosService.obtenerPago(token);
    }

    @Post('ack')
    @HttpCode(HttpStatus.OK)
    async ackWebpay(@Body() body: any) {
        console.log('ACK recibido de Webpay:', body);

        // Extract token from body (Webpay sends it as token_ws)
        const token = body.token_ws;

        if (!token) {
            return {
                ack: "ignored",
                reason: "token_not_provided",
                message: "Token no proporcionado en el ACK"
            };
        }

        return await this.pagosService.procesarAck(token);
    }
}
