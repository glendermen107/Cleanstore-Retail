import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { ProductosModule } from '../productos/productos.module';
import { Producto } from '../productos/producto.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pedido, PedidoItem, Producto]),
        ProductosModule,
    ],
    controllers: [PedidosController],
    providers: [PedidosService],
    exports: [PedidosService],
})
export class PedidosModule { }
