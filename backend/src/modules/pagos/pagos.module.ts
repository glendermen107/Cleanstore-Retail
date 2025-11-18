import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidosModule } from '../pedidos/pedidos.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pago, Pedido]),
        PedidosModule,
    ],
    controllers: [PagosController],
    providers: [PagosService],
    exports: [PagosService],
})
export class PagosModule { }
