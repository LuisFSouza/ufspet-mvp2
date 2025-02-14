-- CreateTable
CREATE TABLE "Clientes" (
    "cod" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "email" TEXT,
    "telefone" VARCHAR(11) NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("cod")
);
