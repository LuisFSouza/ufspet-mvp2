import { forwardRef, Module } from '@nestjs/common';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { ProdutosModule } from 'src/Produtos/produtos.module';
import { AgendamentosModule } from '../Agendamentos/agendamentos.module';
import { ClientesModule } from '../Clientes/clientes.module';

@Module({
    imports: [PrismaModule, ProdutosModule, forwardRef(() => ClientesModule)],
    controllers: [VendasController],
    providers: [VendasService],
    exports: [VendasService]
})
export class VendasModule {}
