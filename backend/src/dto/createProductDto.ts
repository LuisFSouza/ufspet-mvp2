import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
import Decimal from "decimal.js"

export class CreateProductDto{
    @IsString()
    @IsNotEmpty()
    nome: string

    @IsString()
    @IsNotEmpty()
    marca: string

    @IsString()
    @IsOptional()
    fornecedor: string

    @IsDecimal()
    @IsNotEmpty()
    preco: Decimal
    
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    quantidade: number
}