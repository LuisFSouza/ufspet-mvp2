import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClientDto } from 'src/dto/createClientDto';
import { UpdateClientDto } from 'src/dto/updateClientDto';

@Controller('clientes')
export class ClientesController {
    constructor(private readonly clienteService: ClientesService){}

    @Get()
    async list(){
        const clientes = await this.clienteService.readClients()
        return clientes;
    }
    
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        const cliente = await this.clienteService.readClient(id)
        return cliente;
    }  

    @Get(':id/compras')
    async findPurchases(@Param('id', ParseIntPipe) id:number){
        const purchases = await this.clienteService.readSaleAndAppointmentsByClient(id)
        return purchases;
    }  

    @Post('criar')
    async create(@Body() body: CreateClientDto){
        return await this.clienteService.createClient(body)
    }  

    @Patch('editar/:id')
    async edit(@Body() body: UpdateClientDto, @Param('id', ParseIntPipe) id:number){
        return await this.clienteService.updateClient(id,body)
    }  

    @Delete('deletar/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        const cliente = await this.clienteService.deleteClient(id)
        return cliente;
    }  
}
