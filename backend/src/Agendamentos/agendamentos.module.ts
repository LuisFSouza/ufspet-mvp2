/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';
import { ClientesModule } from '../Clientes/clientes.module';
import { ServicosModule } from '../Servicos/servicos.module';

@Module({
    imports: [PrismaModule, forwardRef(() => ClientesModule), ServicosModule],
    controllers: [AgendamentosController],
    providers: [AgendamentosService],
    exports: [AgendamentosService]
})
export class AgendamentosModule {}
