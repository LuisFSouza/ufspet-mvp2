import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ProdutosService } from "./produtos.service";
import { CreateProductDto } from "src/dto/createProductDto";
import { UpdateProductDto } from "src/dto/updateProductDto";

@Controller('produtos')
export class ProdutosController{
    constructor(private readonly produtoService: ProdutosService){}

    @Get()
    async list(){
        const produtos = await this.produtoService.readProducts()
        return produtos;
    }   

    @Get('estoque')
    async listInventory(){
        const produtos = await this.produtoService.readProductsInventory()
        return produtos;
    }

    @Get('disponiveis')
    async listAvailable(){
        const produtos = await this.produtoService.readAvailableProducts()
        return produtos;
    }   

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        const produto = await this.produtoService.readProduct(id)
        return produto
    }  

    @Post('criar')
    async create(@Body() body: CreateProductDto){
        return await this.produtoService.createProduct(body)
    }  

    @Patch('editar/:id')
    async edit(@Body() body: UpdateProductDto, @Param('id', ParseIntPipe) id:number){
        const produto = await this.produtoService.updateProduct(id, body)
        return produto
    }  

    @Delete('deletar/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        const produto = await this.produtoService.deleteProduct(id)
        return produto
    }  

    
}