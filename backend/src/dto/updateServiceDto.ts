import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceDto} from "./createServiceDto";

export class UpdateServiceDto extends PartialType(CreateServiceDto){}