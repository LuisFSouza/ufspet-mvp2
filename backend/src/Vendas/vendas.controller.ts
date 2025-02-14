import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateSaleDto } from 'src/dto/createSaleDto';
import { UpdateSaleDto } from 'src/dto/updateSaleDto';

@Controller('vendas')
export class VendasController {
    constructor(private readonly vendaService: VendasService){}
    @Get()
    async list(){
        const vendas = await this.vendaService.readSales()
        return vendas;
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        const venda = await this.vendaService.readSale(id)
        return venda;
    }  

    @Delete('deletar/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        const venda =  await this.vendaService.deleteSale(id)
        return venda;
    }  

    @Post('criar')
    async create(@Body() body: CreateSaleDto){
        return await this.vendaService.createSale(body)
    }  

    @Patch('editar/:id')
    async edit(@Body() body: UpdateSaleDto, @Param('id', ParseIntPipe) id:number){
        const venda = await this.vendaService.updateSale(id, body)
        return venda
    }  

    @Get('/find/:year')
    async listByYear(@Param('year', ParseIntPipe) year){
        const vendas = await this.vendaService.readSalesByYear(year)
        return vendas;
    }

 }
