import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength } from "class-validator";

export class ActualizarInmobiliariaDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombre?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    descripcion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    logoUrl?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{6}$/, {
        message: "El teléfono debe tener el formato 2254-111111",
    })
    telefonoContacto?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    emailContacto?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    direccionOficina?: string;
}