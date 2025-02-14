import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateSaleDto } from "./createSaleDto";
import { ArrayMinSize, IsArray, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateItemSaleDto } from "./createItemSaleDto";
import { UpdateItemSaleDto } from "./updateItemSaleDto";

export class UpdateSaleDto extends PartialType(OmitType(CreateSaleDto, ['itens'])){
    @IsArray()
    @ArrayMinSize(1)
    @Type(()=>UpdateItemSaleDto)
    @ValidateNested({each:true})
    itens?: UpdateItemSaleDto[]
}
