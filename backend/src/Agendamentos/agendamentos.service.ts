import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/createAppointmentDto';
import { UpdateAppointmentDto } from '../dto/updateAppointmentDto';
import { ClientesService } from '../Clientes/clientes.service';
import { ServicosService } from '../Servicos/servicos.service';

@Injectable()
export class AgendamentosService {
    constructor(private prisma:PrismaService,
        @Inject(forwardRef(() => ClientesService))
        private readonly clienteService: ClientesService,

        private readonly servicoService: ServicosService
    ){}

    async readAppointments(){
        try{
            return await this.prisma.agendamentos.findMany({
                include: {
                    cliente: true,
                    servico: true
                }
            })
        }
        catch {
            throw new HttpException('Ocorreu um erro ao consultar os agendamentos', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readAppointment(id:number,  tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const agendamento = await tx.agendamentos.findUnique({
                where:{
                    cod:id
                },
                include: {
                    cliente: true,
                    servico: true
                }
                
            })
            if(agendamento){
                return agendamento;
            }
            else{
                throw new HttpException('O agendamento não foi encontrado', HttpStatus.NOT_FOUND)
            }
        } 
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar o agendamento', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteAppointment(id:number){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readAppointment(id, tx)
                    return await tx.agendamentos.delete({
                        where: {
                            cod: id
                        }
                    })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao excluir o agendamento', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createAppointment(agendamento: CreateAppointmentDto){
        try{
            return await this.prisma.$transaction(async (tx) => {
                if(await this.clienteService.readClient(agendamento.cliente_id, tx) &&
                await this.servicoService.readService(agendamento.servico_id, tx)){
                    return await tx.agendamentos.create({
                        data: agendamento
                    })
                }
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('cliente_id') && camposErro.includes('servico_id') && camposErro.includes('data')){
                    throw new HttpException('Já existe um agendamento deste serviço nesta data para este cliente', HttpStatus.CONFLICT)
                }
                
            }
            throw new HttpException('Ocorreu um erro ao cadastrar o agendamento', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateAppointment(id:number, agendamento: UpdateAppointmentDto){
        try{
                return await this.prisma.$transaction(async (tx) => {
                    if(await this.clienteService.readClient(agendamento.cliente_id, tx) &&
                    await this.servicoService.readService(agendamento.servico_id, tx) &&
                    await this.readAppointment(id, tx)){
                        return await tx.agendamentos.update({
                                where:{cod:id},
                                data: agendamento
                        })
                    }
                })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('cliente_id') && camposErro.includes('servico_id') && camposErro.includes('data')){
                    throw new HttpException('Já existe um agendamento deste serviço nesta data para este cliente', HttpStatus.CONFLICT)
                }
                
            }
            throw new HttpException('Ocorreu um erro ao cadastrar o agendamento', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        
    }

    async readAppointmentByClient(cliente: number,tx:Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const agendamentos = await tx.agendamentos.findMany({
                where: {
                    cliente_id: cliente
                },
                include: {
                    servico: true
                }
            })
            return agendamentos
        }
        catch (error) {
            throw new HttpException('Ocorreu um erro ao consultar os agendamentos do cliente', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
