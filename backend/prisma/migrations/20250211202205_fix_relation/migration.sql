-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "Agendamentos" DROP CONSTRAINT "Agendamentos_servico_id_fkey";

-- DropForeignKey
ALTER TABLE "Vendas" DROP CONSTRAINT "Vendas_cliente_id_fkey";

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "Servicos"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;
