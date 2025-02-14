import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateClientDto } from '../dto/createClientDto';
import { UpdateClientDto } from '../dto/updateClientDto';
import { AgendamentosService } from '../Agendamentos/agendamentos.service';
import { VendasService } from '../Vendas/vendas.service';

@Injectable()
export class ClientesService {
    constructor(private prisma:PrismaService,
        @Inject(forwardRef(() => AgendamentosService))
        private readonly agendamentoService: AgendamentosService,
        @Inject(forwardRef(() => VendasService))
        private readonly vendasService: VendasService
    ){}

    async readClients(){
        try{
            return await this.prisma.clientes.findMany()
        }
        catch {
            throw new HttpException('Ocorreu um erro ao consultar os clientes', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readClient(id:number,  tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const cliente = await tx.clientes.findUnique({
                where:{
                    cod:id
                }
            })

            if(cliente){
                return cliente;
            }
            else{
                throw new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
            }
        }
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar o cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createClient(cliente: CreateClientDto){
        try{
            return await this.prisma.clientes.create({
                data: cliente
            })
        }
        catch(error){
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('cpf')){
                    throw new HttpException('Já existe um cliente com este CPF', HttpStatus.CONFLICT)
                }
                if(camposErro.includes('email')){
                    throw new HttpException('Já existe um cliente com este email', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao cadastrar o cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateClient(id:number, cliente: UpdateClientDto){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readClient(id, tx)
                return await tx.clientes.update({
                    where:{cod:id},
                    data: cliente
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('cpf')){
                    throw new HttpException('Já existe um cliente com este CPF', HttpStatus.CONFLICT)
                }
                if(camposErro.includes('email')){
                    throw new HttpException('Já existe um cliente com este email', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao editar o cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteClient(id:number){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readClient(id, tx)
                
                return await tx.clientes.delete({
                    where: {
                        cod: id
                    }
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2003'){
                throw new HttpException("Não foi possivel excluir o cliente, pois ele tem pelo menos uma venda ou um agendamento associado", HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Ocorreu um erro ao excluir o cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readSaleAndAppointmentsByClient(client: number){
        return await this.prisma.$transaction(async (tx) => {
            await this.readClient(client, tx)
            const vendas = await this.vendasService.readSaleByClient(client, tx)
            const agendamentos = await this.agendamentoService.readAppointmentByClient(client, tx)
    
            var vendasAgendamentos = [];
            var contador = 1;
            vendas.forEach(venda => {
                vendasAgendamentos.push({cod: contador, cod_op: venda.cod, formaPgto: venda.formaPgto, total: venda.totalVenda, data: venda.data, tipo: 'Venda'})
                contador ++;
            });

            agendamentos.forEach(agendamento => {
                vendasAgendamentos.push({cod: contador, cod_op: agendamento.cod, formaPgto: agendamento.formaPgto, total: Number(agendamento.servico.preco), data: agendamento.data, tipo: 'Agendamento'})
                contador ++;
            });

            return vendasAgendamentos;
        })
    }
}
