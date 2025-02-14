/*
  Warnings:

  - You are about to alter the column `preco` on the `Produtos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `preco` on the `Servicos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Produtos" ALTER COLUMN "preco" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Servicos" ALTER COLUMN "preco" SET DATA TYPE DECIMAL(10,2);
