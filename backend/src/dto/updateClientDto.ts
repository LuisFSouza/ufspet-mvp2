import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./createClientDto";

export class UpdateClientDto extends PartialType(CreateClientDto){}