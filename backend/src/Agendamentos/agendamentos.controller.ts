import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAppointmentDto } from 'src/dto/createAppointmentDto';
import { UpdateAppointmentDto } from 'src/dto/updateAppointmentDto';

@Controller('agendamentos')
export class AgendamentosController { 
    constructor(private readonly agendamentoService: AgendamentosService){}

    @Get()
    async list(){
        const agendamentos = await this.agendamentoService.readAppointments()
        return agendamentos;
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        const agendamento = await this.agendamentoService.readAppointment(id)
        return agendamento
    }  

    @Delete('deletar/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        const agendamento = await this.agendamentoService.deleteAppointment(id)
        return agendamento;
    }  

    @Post('criar')
    async create(@Body() body: CreateAppointmentDto){
        return this.agendamentoService.createAppointment(body)
    }  

    @Patch('editar/:id')
    async edit(@Body() body: UpdateAppointmentDto, @Param('id', ParseIntPipe) id:number){
        const agendamento = await this.agendamentoService.updateAppointment(id, body)
        return agendamento
    }  
}
