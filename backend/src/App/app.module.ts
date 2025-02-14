import { ServicosModule } from '../Servicos/servicos.module';
import { ClientesModule } from '../Clientes/clientes.module';
import { forwardRef, Module } from '@nestjs/common';
import { ProdutosModule } from '../Produtos/produtos.module';
import { AgendamentosModule } from 'src/Agendamentos/agendamentos.module';
import { VendasModule } from 'src/Vendas/vendas.module';

@Module({
  imports: [forwardRef(() => ServicosModule), ClientesModule, ProdutosModule, forwardRef(() => AgendamentosModule), VendasModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
