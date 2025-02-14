-- CreateTable
CREATE TABLE "Produtos" (
    "cod" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "fornecedor" TEXT,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("cod")
);
