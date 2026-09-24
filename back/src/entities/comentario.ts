import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "./propiedad";

@Entity("comentarios")
export class Comentario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    nombreAutor!: string;

    @Column({ type: "text" })
    contenido!: string;

    @Column({ 
        type: "text", 
        nullable: true, 
    })
    respuesta?: string;

    @ManyToOne(() => Propiedad, {
        nullable: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "propiedad_id" })
    propiedad!: Propiedad;

    @CreateDateColumn()
    creadoEn!: Date;
}
