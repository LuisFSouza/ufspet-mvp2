import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateServiceDto } from '../dto/createServiceDto';
import { UpdateServiceDto } from '../dto/updateServiceDto';

@Injectable()
export class ServicosService {
    constructor(private prisma:PrismaService){}
    async readServices(){
        try{
            return await this.prisma.servicos.findMany()
        }
        catch {
            throw new HttpException('Ocorreu um erro ao consultar os serviços', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async readService(id:number, tx : Prisma.TransactionClient | PrismaClient = this.prisma){
        try{
            const servico =  await tx.servicos.findUnique({
                where:{
                    cod:id
                }
            })
            if(servico){
                return servico;
            }
            else{
                throw new HttpException('O serviço não foi encontrado', HttpStatus.NOT_FOUND)
            }
        }
        catch(error) {
            if(error instanceof HttpException){throw error}
            throw new HttpException('Ocorreu um erro ao consultar o serviço', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createService(service: CreateServiceDto){
        try{
            return await this.prisma.servicos.create({
                data: service
            })
        }
        catch(error){
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('nome')){
                    throw new HttpException('Já existe um serviço com este nome', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao cadastrar o serviço', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateService(id:number, service: UpdateServiceDto){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readService(id, tx)
                return await tx.servicos.update({
                    where:{cod:id},
                    data: service
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2002'){
                const camposErro = error.meta.target;
                if(camposErro.includes('nome')){
                    throw new HttpException('Já existe um serviço com este nome', HttpStatus.CONFLICT)
                }
            }
            throw new HttpException('Ocorreu um erro ao editar o serviço', HttpStatus.INTERNAL_SERVER_ERROR)
        }  
    }

    async deleteService(id:number){
        try{
            return await this.prisma.$transaction(async (tx) => {
                await this.readService(id, tx)
                return await tx.servicos.delete({
                    where: {
                        cod: id
                    }
                })
            })
        }
        catch(error){
            if(error instanceof HttpException){throw error}
            if(error.code === 'P2003'){
                throw new HttpException("Não foi possivel excluir o serviço pois ele tem pelo menos um agendamento associado", HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Ocorreu um erro ao excluir o serviço', HttpStatus.INTERNAL_SERVER_ERROR)
        }  
    }
}
