import {
    IsArray,
    IsEnum,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    IsNumberString,
    isString,
} from "class-validator";

import { TipoPropiedad, Operacion } from "../entities/enums";

// Datos permitidos para crear una propiedad
export class CrearPropiedadDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @IsEnum(TipoPropiedad)
    tipo!: TipoPropiedad;

    @IsEnum(Operacion)
    operacion!: Operacion;

    @IsNumberString()
    precio!: string;

    @IsIn(["ARS", "USD"])
    moneda!: "ARS" | "USD";

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    direccion!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    zona!: string;

    @IsOptional()
    @IsNumberString()
    superficieCubiertaM2?: string;

    @IsNumberString()
    superficieTotalM2!: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    ambientes?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    dormitorios?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    banios?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    antiguedadAnios?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];

    // La inmobiliaria se recibe por id. El service verifica que exista
    @IsUUID()
    inmobiliariaId!: string;
}

export class ActualizarPropiedadDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    titulo?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    descripcion?: string;

    @IsOptional()
    @IsEnum(TipoPropiedad)
    tipo?: TipoPropiedad;

    @IsOptional()
    @IsEnum(Operacion)
    operacion?: Operacion;

    @IsOptional()
    @IsNumberString()
    precio?: string;

    @IsOptional()
    @IsIn(["ARS", "USD"])
    moneda?: "ARS" | "USD";

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    direccion?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    zona?: string;

    @IsOptional()
    @IsNumberString()
    superficieCubiertaM2?: string;

    @IsOptional()
    @IsNumberString()
    superficieTotalM2?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    ambientes?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    dormitorios?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    banios?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    antiguedadAnios?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];
}