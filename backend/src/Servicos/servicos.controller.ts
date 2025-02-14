import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServiceDto } from 'src/dto/createServiceDto';
import { UpdateServiceDto } from 'src/dto/updateServiceDto';

@Controller('servicos')
export class ServicosController { 
    constructor(private readonly servicoService: ServicosService){}

    @Get()
    async list(){
        const servicos = await this.servicoService.readServices()
        return servicos;
    }
    
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        const servico = await this.servicoService.readService(id)
        return servico
    }  

    @Post('criar')
    async create(@Body() body: CreateServiceDto){
        return await this.servicoService.createService(body)
    }  

    @Patch('editar/:id')
    async edit(@Body() body: UpdateServiceDto, @Param('id', ParseIntPipe) id:number){
        const servico = await this.servicoService.updateService(id, body)
        return servico
    }  

    @Delete('deletar/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        const servico = await this.servicoService.deleteService(id)
        return servico
    }  

}
