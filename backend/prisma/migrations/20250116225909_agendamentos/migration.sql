-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pendente', 'Cancelado', 'Concluido');

-- CreateEnum
CREATE TYPE "FormasPagamento" AS ENUM ('Cartão debito', 'Cartão crédito', 'PIX', 'Dinheiro');

-- CreateTable
CREATE TABLE "Agendamentos" (
    "cod" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "servico_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "formaPgto" "FormasPagamento" NOT NULL,

    CONSTRAINT "Agendamentos_pkey" PRIMARY KEY ("cod")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agendamentos_cliente_id_servico_id_data_key" ON "Agendamentos"("cliente_id", "servico_id", "data");

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cod") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamentos" ADD CONSTRAINT "Agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "Servicos"("cod") ON DELETE CASCADE ON UPDATE CASCADE;
