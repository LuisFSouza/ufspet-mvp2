import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaService } from "../Prisma/prisma.service";
import { CreateProductDto } from "../dto/createProductDto";
import { UpdateProductDto } from "../dto/updateProductDto";
import { UpdateItemSaleDto } from "../dto/updateItemSaleDto";
import { CreateItemSaleDto } from "../dto/createItemSaleDto";

@Injectable()
export class ProdutosService{
    constructor(private prisma:PrismaService){}

    async readProducts(){
        try{
            return await this.prisma.produtos.findMany()
        }
        catch {
            throw new HttpException('Ocorreu um erro ao consultar os produtos', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readProduct(id:number, tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const produto =  await tx.produtos.findUnique({
                where:{
                    cod:id
                }
            })
            if(produto){
                return produto;
            }
            else{
                throw new HttpException('O produto não foi encontrado', HttpStatus.NOT_FOUND)
            }
        } 
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar o produto', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createProduct(produto: CreateProductDto){
        try{
            return await this.prisma.produtos.create({
                data: produto
            })
        }
        catch(error){
            throw new HttpException('Ocorreu um erro ao cadastrar o produto', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateProduct(id:number, produto: UpdateProductDto, tx: Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            if('$transaction' in tx){
                return await tx.$transaction(async (tx1) => {
                    await this.readProduct(id, tx1)
                    return await tx1.produtos.update({
                        where:{cod:id},
                        data: produto
                    })
                })
            }
            else{
                await this.readProduct(id, tx)
                return await tx.produtos.update({
                        where:{cod:id},
                        data: produto
                })
            }
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao editar o produto', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    async readProductsInventory(){
        try{
            return await this.prisma.produtos.findMany(
                {
                    where:{
                        quantidade: {
                            lt: 10
                        }
                    }
                }
            )
        }
        catch {
            throw new HttpException('Ocorreu um erro ao consultar o estoque', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteProduct(id:number){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readProduct(id, tx)
                return await tx.produtos.delete({
                    where: {
                        cod: id
                    }
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2003'){
                throw new HttpException("Não foi possivel excluir o produto pois ele tem pelo menos uma venda associada", HttpStatus.BAD_REQUEST)
            }
            throw new HttpException("Ocorreu um erro ao deletar o produto", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readManyProducts(itensVenda: CreateItemSaleDto[] | UpdateItemSaleDto[], tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            if(itensVenda.length > 0){
                return await tx.produtos.findMany({
                    where:{
                        cod: {in: itensVenda.map(item => item.produto_id)}
                    },
                    select:{
                        cod:true,
                        preco:true,
                        quantidade: true,
                        nome: true
                    }
                })
            }
            else{
                return []
            }
        }
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar os produtos', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readAvailableProducts(){
        try{
            const produtos =  await this.prisma.produtos.findMany({
                where:{
                    quantidade: {
                        gt: 0
                    }
                }
            })
            return produtos;
        } 
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar os produtos disponíveis', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}