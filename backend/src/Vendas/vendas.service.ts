import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateSaleDto } from '../dto/createSaleDto';
import { UpdateSaleDto } from '../dto/updateSaleDto';
import { ProdutosService } from '../Produtos/produtos.service';
import Decimal from 'decimal.js';
import { AgendamentosService } from '../Agendamentos/agendamentos.service';
import { ClientesService } from '../Clientes/clientes.service';

@Injectable()
export class VendasService {
    constructor(private prisma:PrismaService, private readonly produtoService: ProdutosService,
        @Inject(forwardRef(() => ClientesService))
        private readonly clienteService: ClientesService
    ){}
    async readSales(){
        try{
            const sales = await this.prisma.vendas.findMany({
                include: {
                    itens: true
                }
            })
    
            const saleTotal = sales.map(sale => {
                const total = sale.itens.reduce((acumulador, item) => acumulador + parseFloat(item.total.toString()), 0)
                return {
                    ...sale,
                    totalVenda: total
                };
            }) 
    
            return saleTotal;
        }
        catch (error) {
            throw new HttpException('Ocorreu um erro ao consultar as vendas', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readSale(id:number, tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const venda = await tx.vendas.findUnique({
                where:{
                    cod:id
                },
                include: {
                    itens: {
                        include: {
                            produto: true
                        }
                    },
                    cliente: true
                    
                }
            })
            if(venda){
                const total = venda.itens.reduce((acumulador, item) => acumulador + parseFloat(item.total.toString()), 0)
                return {
                    ...venda,
                    totalVenda: total
                };
            }
            else{
                throw new HttpException('A venda não foi encontrada', HttpStatus.NOT_FOUND)
            }
        } 
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar a venda', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    
    async deleteSale(id:number){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readSale(id, tx)
                return await tx.vendas.delete({
                    where: {
                        cod: id
                    }
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao excluir a venda', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    
    async createSale(sale: CreateSaleDto){
        try{
            var produtosEmFalta = []
            return await this.prisma.$transaction(async (tx) => {
                if(await this.clienteService.readClient(sale.cliente_id, tx)){
                    const venda = await tx.vendas.create({
                        data: {
                            cliente_id: sale.cliente_id,
                            formaPgto: sale.formaPgto,
                            data: sale.data
                        }
                    })

                    if(sale.itens.length > 0){
                        const produtos = await this.produtoService.readManyProducts(sale.itens, tx)
                        const itensVenda = []
                        for (const item of sale.itens){
                            const produto = produtos.find(produto => produto.cod === item.produto_id);
                                if(!produto){
                                    throw new HttpException(`O produto ${item.produto_id} não foi encontrado na base de dados`, HttpStatus.NOT_FOUND)
                                }
                                if(produto.quantidade < item.quantidade){
                                    throw new HttpException(`Não há quantidade suficiente do produto ${produto.nome}`, HttpStatus.CONFLICT)
                                }
                                produto.quantidade = produto.quantidade - item.quantidade;

                                if(produto.quantidade < 10){
                                    produtosEmFalta.push({produto: produto.nome, quantidade: produto.quantidade})
                                }
                                produto.preco = produto.preco //Arrumar aqui
                                const produto1 = {...produto}
                                await this.produtoService.updateProduct(produto.cod, produto1, tx)
                                
                                itensVenda.push({
                                    venda_id: venda.cod,
                                    produto_id: item.produto_id,
                                    quantidade: item.quantidade,
                                    total: Number(new Decimal(produto.preco).mul(item.quantidade)) //Arrumar aqui
                                })
                        }

                        await tx.itensVenda.createMany({
                            data: itensVenda
                        })
                    }
        
                    return produtosEmFalta;
                }
            })
        }
        catch(error){                                                                                                                                                                             
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                if(error.message.includes('itensVenda')){
                    throw new HttpException('Há um produto repetido na venda', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao cadastrar a venda', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    async updateSale(id:number, sale: UpdateSaleDto){
        var produtosEmFalta = []
        try{
            return await this.prisma.$transaction(async (tx) => {
                if(await this.clienteService.readClient(sale.cliente_id, tx) &&
                await this.readSale(id, tx)) {
          
                    const venda = await tx.vendas.update({
                        data: {
                            cliente_id: sale.cliente_id,
                            formaPgto: sale.formaPgto,
                            data: sale.data
                        },
                        where:{
                            cod:id
                        }
                    })
                    
                        
                    const itensDaVenda = await tx.itensVenda.findMany({
                        where:{
                            venda_id: id
                        },
                        include: {
                            produto: true
                        }
                    })
                    
                    for (const item of itensDaVenda) {
                        await this.produtoService.updateProduct(item.produto_id, {...item.produto, quantidade:item.produto.quantidade + item.quantidade, preco: item.produto.preco}, tx);
                    }
                    
                    
                    //Exclui os itens da venda que estavam anteriormente, ajustando as quantidades
                    
                    await tx.itensVenda.deleteMany({
                        where: {
                            venda_id: id
                        }
                    })

                    if(sale.itens.length > 0){
                        const produtos = await this.produtoService.readManyProducts(sale.itens, tx)
                        //Adiciona os itens
                        const itensVenda = []
                        for (const item of sale.itens){
                                const produto = produtos.find(produto => produto.cod === item.produto_id);
                                if(!produto){
                                    throw new HttpException(`O produto ${item.produto_id} não foi encontrado na base de dados`, HttpStatus.NOT_FOUND)
                                }
                                if(produto.quantidade < item.quantidade){
                                    throw new HttpException(`Não há quantidade suficiente do produto ${produto.nome}`, HttpStatus.CONFLICT)
                                }

                                produto.quantidade = produto.quantidade - item.quantidade;

                                if(produto.quantidade < 10){
                                    produtosEmFalta.push({produto: produto.nome, quantidade: produto.quantidade})
                                }

                                produto.preco = produto.preco //Arrumar aqui
                                const produto1 = {...produto}
                                await this.produtoService.updateProduct(produto.cod, produto1, tx)

                                itensVenda.push({
                                    venda_id: venda.cod,
                                    produto_id: item.produto_id,
                                    quantidade: item.quantidade,
                                    total: Number(new Decimal(produto.preco).mul(item.quantidade))
                                })
                        }
                        await tx.itensVenda.createMany({
                            data: itensVenda
                        })
                    }  

                    return produtosEmFalta;
                }
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                if(error.message.includes('itensVenda')){
                    throw new HttpException('Há um produto repetido na venda', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao editar a venda', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readSalesByYear(year: number){
        try{
            const sales = await this.prisma.vendas.findMany({
                include: {
                    itens: true
                },
                where: {
                    data: {
                        gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        lt: new Date(`${year+1}-01-01T00:00:00.000Z`),
                    }
                }

            })
    
            const {salesTotal, quantityItensSales} = sales.reduce((acumuladorFora, sale) => {
                const totalVenda = sale.itens.reduce((acumuladorDentro, item) => acumuladorDentro + parseFloat(item.total.toString()), 0)
                const quantityItensVenda = sale.itens.reduce((acumuladorDentro, item) => acumuladorDentro + item.quantidade, 0)
            
                
                return {
                    salesTotal: acumuladorFora.salesTotal + totalVenda,
                    quantityItensSales: acumuladorFora.quantityItensSales + quantityItensVenda
                }
            }, {salesTotal: 0, quantityItensSales: 0}) 

            type VendasMensais = {
                salesTotal: number;
                quantityItensSales: number;
            }

            const vendasInfo = sales.reduce<(VendasMensais)[]>((acumuladorFora,  sale) => {
                const mes = new Date(sale.data).getMonth()

                const totalVenda = sale.itens.reduce((acumuladorDentro, item) => acumuladorDentro + parseFloat(item.total.toString()), 0)
                const quantityItensVenda = sale.itens.reduce((acumuladorDentro, item) => acumuladorDentro + item.quantidade, 0)

                acumuladorFora[mes].salesTotal += totalVenda;
                acumuladorFora[mes].quantityItensSales += quantityItensVenda;

                return acumuladorFora;
            }, new Array(12).fill(null).map( () => ({salesTotal: 0, quantityItensSales: 0})))

            return [{receita: salesTotal, quantidade: quantityItensSales, vendasInfo }];
        }
        catch (erro) {
            throw new HttpException('Ocorreu um erro ao consultar as vendas deste ano', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async readSaleByClient(client: number, tx :Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const sales = await tx.vendas.findMany({
                where: {
                    cliente_id: client
                },
                include: {
                    itens: true
                }
            })
    
            const saleTotal = sales.map(sale => {
                const total = sale.itens.reduce((acumulador, item) => acumulador + parseFloat(item.total.toString()), 0)
                return {
                    ...sale,
                    totalVenda: total
                };
            }) 
    
            return saleTotal;
        }
        catch (error) {
            throw new HttpException('Ocorreu um erro ao consultar as vendas do cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

