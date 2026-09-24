import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegistrarVendedorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombreCompleto!: string;

    @IsEmail()
    @MaxLength(255)
    email!: string;

    @IsString()
    @MinLength(6)
    contrasenia!: string;

    @IsOptional()
    @IsString()
    @MaxLength(40)
    telefono?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombreInmobiliaria!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    logoUrl?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    telefonoContacto!: string;

    @IsEmail()
    @MaxLength(255)
    emailContacto!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    direccionOficina?: string;

}

export class LoginVendedorDto {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    contrasenia!: string;
}