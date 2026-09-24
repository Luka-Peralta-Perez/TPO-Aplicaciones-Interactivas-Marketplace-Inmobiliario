import { IsNotEmpty, IsString, Max, MaxLength, IsInt, Min } from "class-validator";


export class CrearReseniaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombreAutor!: string;

    @IsString()
    @IsNotEmpty()
    contenido!: string;

    @IsInt()
    @Min(1)
    @Max(5)
    calificacion!: number;

}