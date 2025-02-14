import { FormasPagamento, Status } from "@prisma/client"
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator"

export class CreateAppointmentDto{
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    cliente_id: number

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    servico_id: number

    @IsOptional()
    @IsDateString()
    data: Date

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status

    @IsEnum(FormasPagamento)
    @IsNotEmpty()
    formaPgto: FormasPagamento
}