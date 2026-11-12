import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegistrarVendedorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    apellido!: string;

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

}

export class LoginVendedorDto {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    contrasenia!: string;
}