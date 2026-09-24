import { Type } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    Max,
    IsNumberString,
} from "class-validator";

import { TipoPropiedad, Operacion, EstadoPropiedad } from "../entities/enums";

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

    @IsInt()
    @Min(1)
    inmobiliariaId!: number;
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

export class FiltrarPropiedadesDto {
    @IsOptional()
    @IsEnum(TipoPropiedad)
    tipo?: TipoPropiedad;

    @IsOptional()
    @IsEnum(Operacion)
    operacion?: Operacion;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    zona?: string;

    @IsOptional()
    @IsNumberString()
    precioMin?: string;

    @IsOptional()
    @IsNumberString()
    precioMax?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    ambientes?: number;

    @IsOptional()
    @IsString()
    amenities?: string;

    // Texto libre
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    q?: string;

    @IsOptional()
    @IsIn(["precio", "fechaPublicacion", "superficieTotal"])
    sort?: "precio" | "fechaPublicacion" | "superficieTotal";

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number;

}

export class CambiarEstadoPropiedadDto {
    @IsEnum(EstadoPropiedad)
    estado!: EstadoPropiedad;
}