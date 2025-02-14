import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';

@Module({
    imports: [PrismaModule],
    controllers: [ServicosController],
    providers: [ServicosService],
    exports: [ServicosService]
})
export class ServicosModule {}
