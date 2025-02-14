-- CreateTable
CREATE TABLE "Vendas" (
    "cod" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formaPgto" "FormasPagamento" NOT NULL,

    CONSTRAINT "Vendas_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "ItensVenda" (
    "cod" SERIAL NOT NULL,
    "venda_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ItensVenda_pkey" PRIMARY KEY ("cod")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItensVenda_venda_id_produto_id_key" ON "ItensVenda"("venda_id", "produto_id");

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("cod") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensVenda" ADD CONSTRAINT "ItensVenda_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "Vendas"("cod") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensVenda" ADD CONSTRAINT "ItensVenda_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produtos"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;
