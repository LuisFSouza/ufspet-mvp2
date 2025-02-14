import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"
import { CreateItemSaleDto } from "./createItemSaleDto"
import { FormasPagamento } from "@prisma/client"

export class CreateSaleDto{
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    cliente_id: number
    
    @IsOptional()
    @IsDateString()
    data: Date
 
    @IsEnum(FormasPagamento)
    @IsNotEmpty()
    formaPgto: FormasPagamento
 
    @IsArray()
    @Type(()=>CreateItemSaleDto)
    @ValidateNested({each:true})
    @ArrayMinSize(1)
    itens: CreateItemSaleDto[]
 }