import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';
import { Pago } from './pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';

@Injectable()
export class PagosService {
    private webpayPlus: any;

    constructor(
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
    ) {
        // Configure WebpayPlus in TEST mode
        const options = new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        );
        this.webpayPlus = new WebpayPlus.Transaction(options);
    }

    async iniciarTransaccion(pedidoId: string, monto: number) {
        // Validate pedido exists
        const pedido = await this.pedidoRepository.findOne({ where: { id: pedidoId } });
        if (!pedido) {
            throw new NotFoundException(`Pedido con ID ${pedidoId} no encontrado`);
        }

        // Create transaction with WebpayPlus
        const buyOrder = `ORDER-${Date.now()}`;
        const sessionId = `SESSION-${pedidoId}`;
        const returnUrl = `http://localhost:4000/pagos/retorno`;
        // Note: Webpay will also send ACK to POST /pagos/ack automatically
        //const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:4000'}/pagos/resultado`;

        try {
            const response = await this.webpayPlus.create(
                buyOrder,
                sessionId,
                monto,
                returnUrl
            );

            // Save pago entity
            const pago = this.pagoRepository.create({
                pedidoId,
                token: response.token,
                monto,
                estado: 'iniciado',
                responseData: response,
            });

            await this.pagoRepository.save(pago);

            return {
                token: response.token,
                url: response.url,
            };
        } catch (error) {
            throw new BadRequestException(`Error al iniciar transacción: ${error.message}`);
        }
    }

    async confirmarTransaccion(token: string) {
        console.log('Buscando pago con token:', token);

        // Find pago by token
        const pago = await this.pagoRepository.findOne({
            where: { token },
            relations: ['pedido'],
        });

        console.log('Pago encontrado:', pago ? 'SI' : 'NO');

        if (!pago) {
            return {
                error: "token_ws_no_encontrado",
                message: `Pago con token ${token} no encontrado`,
                statusCode: 404
            };
        }

        // Check if token was already processed
        if (pago.estado !== 'iniciado') {
            return {
                error: "token_ws_ya_procesado",
                message: "Este token ya fue procesado anteriormente",
                estado: pago.estado,
                pedido: {
                    id: pago.pedido.id,
                    estado: pago.pedido.estado,
                }
            };
        }

        try {
            // Confirm transaction with Webpay
            const response = await this.webpayPlus.commit(token);
            console.log('Respuesta de Webpay:', response);

            // Validate amount consistency
            const expectedAmount = Number(pago.monto);
            const receivedAmount = Number(response.amount);

            if (Math.abs(expectedAmount - receivedAmount) > 0.01) {
                pago.estado = 'rechazado';
                pago.responseData = { ...response, error: 'monto_inconsistente' };
                pago.pedido.estado = 'cancelado';

                await this.pagoRepository.save(pago);
                await this.pedidoRepository.save(pago.pedido);

                return {
                    estado: "rechazado",
                    motivo: "monto_inconsistente",
                    montoEsperado: expectedAmount,
                    montoRecibido: receivedAmount,
                    pedido: {
                        id: pago.pedido.id,
                        estado: "cancelado"
                    }
                };
            }

            // Handle different response codes
            let estadoPago: string;
            let estadoPedido: string;
            let motivo: string;

            if (response.response_code === 0) {
                estadoPago = 'autorizado';
                estadoPedido = 'pagado';
                motivo = 'transaccion_aprobada';
            } else if (response.response_code === -1) {
                estadoPago = 'rechazado';
                estadoPedido = 'cancelado';
                motivo = 'transaccion_cancelada_por_usuario';
            } else {
                estadoPago = 'rechazado';
                estadoPedido = 'cancelado';
                motivo = 'webpay_rechazo_transaccion';
            }

            // Update pago entity
            pago.estado = estadoPago;
            pago.codigoAutorizacion = response.authorization_code;
            pago.fechaTransaccion = new Date(response.transaction_date);
            pago.metodoPago = response.payment_type_code;
            pago.responseData = response;

            // Update pedido estado
            pago.pedido.estado = estadoPedido;

            await this.pagoRepository.save(pago);
            await this.pedidoRepository.save(pago.pedido);

            if (estadoPago === 'autorizado') {
                return {
                    estado: estadoPago,
                    codigoAutorizacion: pago.codigoAutorizacion,
                    monto: pago.monto,
                    fechaTransaccion: pago.fechaTransaccion,
                    metodoPago: pago.metodoPago,
                    motivo: motivo,
                    pedido: {
                        id: pago.pedido.id,
                        estado: pago.pedido.estado,
                    },
                };
            } else {
                return {
                    estado: estadoPago,
                    codigo: response.response_code.toString(),
                    motivo: motivo,
                    monto: pago.monto,
                    pedido: {
                        id: pago.pedido.id,
                        estado: estadoPedido,
                    }
                };
            }

        } catch (error) {
            console.log('Error en commit de Webpay:', error);

            // Check if it's a "already processed" error from Webpay
            if (error.message && error.message.includes('Invalid status') && error.message.includes('for transaction while authorizing')) {
                // This means the token was already processed by Webpay
                // Update our local state to reflect this
                pago.estado = 'procesado_externamente';
                pago.responseData = { error: 'token_ya_procesado_en_webpay', originalError: error.message };

                await this.pagoRepository.save(pago);

                return {
                    error: "token_ws_ya_procesado",
                    message: "Este token ya fue procesado en Webpay anteriormente",
                    motivo: "doble_confirmacion_detectada",
                    estado: pago.estado,
                    pedido: {
                        id: pago.pedido.id,
                        estado: pago.pedido.estado,
                    }
                };
            }

            // Handle other Webpay errors
            if (error.response && error.response.status === 422) {
                pago.estado = 'rechazado';
                pago.responseData = { error: 'webpay_422_error', originalError: error.message };
                pago.pedido.estado = 'cancelado';

                await this.pagoRepository.save(pago);
                await this.pedidoRepository.save(pago.pedido);

                return {
                    estado: 'rechazado',
                    motivo: 'webpay_rechazo_transaccion',
                    codigo: '422',
                    error: 'Transacción rechazada por Webpay',
                    pedido: {
                        id: pago.pedido.id,
                        estado: 'cancelado'
                    }
                };
            }

            // Generic error handling
            pago.estado = 'fallido';
            pago.responseData = { error: error.message };
            pago.pedido.estado = 'cancelado';

            await this.pagoRepository.save(pago);
            await this.pedidoRepository.save(pago.pedido);

            return {
                estado: 'fallido',
                motivo: 'error_tecnico_webpay',
                error: error.message,
                pedido: {
                    id: pago.pedido.id,
                    estado: 'cancelado'
                }
            };
        }
    }

    async obtenerPago(token: string) {
        const pago = await this.pagoRepository.findOne({
            where: { token },
            relations: ['pedido'],
        });

        if (!pago) {
            throw new NotFoundException(`Pago con token ${token} no encontrado`);
        }

        return pago;
    }

    async procesarAck(token: string) {
        console.log('Procesando ACK para token:', token);

        // Find pago by token
        const pago = await this.pagoRepository.findOne({
            where: { token },
            relations: ['pedido'],
        });

        // CRITICAL: Always return 200 OK, even if token doesn't exist
        if (!pago) {
            console.log('ACK para token inexistente:', token);
            return {
                ack: "ignored",
                reason: "token_not_found",
                message: "Token no encontrado en la base de datos"
            };
        }

        // Log current state
        console.log(`ACK para pago existente - Estado actual: ${pago.estado}`);

        // If payment is already processed, acknowledge but don't reprocess
        if (pago.estado !== 'iniciado') {
            console.log('ACK para pago ya procesado - No reprocesando');
            return {
                ack: "ok",
                status: pago.estado,
                message: "Pago ya procesado anteriormente",
                pedido: {
                    id: pago.pedido.id,
                    estado: pago.pedido.estado
                }
            };
        }

        // If payment is still in 'iniciado' state, it means the user flow didn't complete
        // but Webpay is sending ACK (this can happen in some edge cases)
        console.log('ACK para pago en estado iniciado - Marcando como ACK recibido');

        // Update pago to indicate ACK was received
        pago.responseData = {
            ...pago.responseData,
            ack_received: true,
            ack_timestamp: new Date().toISOString()
        };

        await this.pagoRepository.save(pago);

        return {
            ack: "ok",
            status: "ack_received",
            message: "ACK procesado correctamente",
            pedido: {
                id: pago.pedido.id,
                estado: pago.pedido.estado
            }
        };
    }
}
