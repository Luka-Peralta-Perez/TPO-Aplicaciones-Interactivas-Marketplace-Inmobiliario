import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { TipoActividad } from "./enums";
import { Inmobiliaria } from "./inmobiliaria";

@Entity("actividades")
export class Actividad {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: TipoActividad,
    })
    tipo!: TipoActividad;

    // Guarda el id del comentario, solicitud, propiedad o reseña que origino la actividad
    @Column({ type: "integer" })
    referenciaOrigen!: number;

    @Column({
        type: "boolean",
        default: false,
    })
    leida!: boolean;

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
