import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { EstadoSolicitudVisita } from "../entities/enums";

export class CrearSolicitudVisitaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombreSolicitante!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    telefono!: string;

    @IsDateString()
    fechaPropuesta!: string;

    @IsOptional()
    @IsString()
    mensaje?: string;
}

export class CambiarEstadoSolicitudVisitaDto {
    @IsEnum(EstadoSolicitudVisita)
    estado!: EstadoSolicitudVisita;
}