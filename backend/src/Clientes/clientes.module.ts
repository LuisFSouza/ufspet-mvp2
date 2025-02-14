import { forwardRef, Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { VendasModule } from '../Vendas/vendas.module';
import { AgendamentosModule } from '../Agendamentos/agendamentos.module';

@Module({
    imports: [PrismaModule, forwardRef(() => VendasModule), forwardRef(() => AgendamentosModule)],
    controllers: [ClientesController],
    providers: [ClientesService],
    exports: [ClientesService]
})
export class ClientesModule { }
