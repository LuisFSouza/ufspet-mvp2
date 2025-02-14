-- CreateTable
CREATE TABLE "Servicos" (
    "cod" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Servicos_pkey" PRIMARY KEY ("cod")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servicos_nome_key" ON "Servicos"("nome");
