import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    controllers: [],
    providers: [PrismaService],
    imports: [],
    exports: [PrismaService]
})
export class PrismaModule{}