import {PartialType } from "@nestjs/mapped-types";
import { CreateItemSaleDto } from "./createItemSaleDto";

export class UpdateItemSaleDto extends PartialType(CreateItemSaleDto){}
