import { IsInt, IsNotEmpty, IsPositive } from "class-validator"

export class CreateItemSaleDto{
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    produto_id: number

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantidade: number
}