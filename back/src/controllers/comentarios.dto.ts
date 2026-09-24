import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CrearComentarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombreAutor!: string;

    @IsString()
    @IsNotEmpty()
    contenido!: string;


}

export class ResponderComentarioDto {
    @IsString()
    @IsNotEmpty()
    respuesta!: string;
}