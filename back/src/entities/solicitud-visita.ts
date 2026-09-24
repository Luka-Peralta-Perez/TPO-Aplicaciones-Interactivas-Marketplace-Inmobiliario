import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "./propiedad";
import { EstadoSolicitudVisita } from "./enums";

@Entity("solicitudes_visita")
export class SolicitudVisita {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    nombreSolicitante!: string;

    @Column({ length: 40 })
    telefono!: string;

    @Column({ type: "timestamp" })
    fechaPropuesta!: Date;

    @Column({
        type: "text",
        nullable: true,
    })
    mensaje?: string;

    @Column({
        type: "enum",
        enum: EstadoSolicitudVisita,
        default: EstadoSolicitudVisita.PENDIENTE,
    })
    estado!: EstadoSolicitudVisita;

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
