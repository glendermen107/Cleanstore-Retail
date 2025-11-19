import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import existing entities
import { Producto } from '../productos/producto.entity';
import { Categoria } from '../categorias/categoria.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoItem } from '../pedidos/entities/pedido-item.entity';
import { Pago } from '../pagos/pago.entity';
import { ProductoImagen } from '../imagenes/entities/producto-imagen.entity';

// Import existing modules for dependencies
import { ProductosModule } from '../productos/productos.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { PagosModule } from '../pagos/pagos.module';
import { ImagenesModule } from '../imagenes/imagenes.module';

// Import admin services (to be created)
import { AdminProductosService } from './services/admin-productos.service';
import { AdminCategoriasService } from './services/admin-categorias.service';
import { AdminPedidosService } from './services/admin-pedidos.service';
import { AdminEstadisticasService } from './services/admin-estadisticas.service';

// Import admin controllers (to be created)
import { AdminProductosController } from './controllers/admin-productos.controller';
import { AdminCategoriasController } from './controllers/admin-categorias.controller';
import { AdminPedidosController } from './controllers/admin-pedidos.controller';
import { AdminEstadisticasController } from './controllers/admin-estadisticas.controller';

@Module({
    imports: [
        // Register TypeORM entities for direct database access
        TypeOrmModule.forFeature([
            Producto,
            Categoria,
            Pedido,
            PedidoItem,
            Pago,
            ProductoImagen,
        ]),

        // Import existing modules to access their services
        ProductosModule,
        CategoriasModule,
        PedidosModule,
        PagosModule,
        ImagenesModule,
    ],
    controllers: [
        AdminProductosController,
        AdminCategoriasController,
        AdminPedidosController,
        AdminEstadisticasController,
    ],
    providers: [
        AdminProductosService,
        AdminCategoriasService,
        AdminPedidosService,
        AdminEstadisticasService,
    ],
    exports: [
        AdminProductosService,
        AdminCategoriasService,
        AdminPedidosService,
        AdminEstadisticasService,
    ],
})
export class AdminModule { }