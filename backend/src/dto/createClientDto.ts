import {IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateClientDto{
    @IsString()
    @IsNotEmpty()
    nome: string

    @IsString()
    @IsNotEmpty()
    cpf: string

    @IsString()
    @IsOptional()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    telefone: string

    @IsString()
    @IsNotEmpty()
    endereco: string
}