import { PartialType } from "@nestjs/mapped-types";
import { CreateAppointmentDto } from "./createAppointmentDto";

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto){}