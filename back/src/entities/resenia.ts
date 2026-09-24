import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inmobiliaria } from "./inmobiliaria";

@Entity("resenias")
export class Resenia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    nombreAutor!: string;

    @Column({ type: "text" })
    contenido!: string;

    @Column({ type: "smallint" })
    calificacion!: number;

    @ManyToOne(() => Inmobiliaria, {
        nullable: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })

    @JoinColumn({ name: "inmobiliaria_id" })
    inmobiliaria!: Inmobiliaria;

    @CreateDateColumn()
    creadoEn!: Date;
}