import { Module } from "@nestjs/common";
import { ProdutosController } from "./produtos.controller";
import { ProdutosService } from "./produtos.service";
import { PrismaModule } from "src/Prisma/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers: [ProdutosController],
    providers: [ProdutosService],
    exports: [ProdutosService]
})
export  class ProdutosModule{}