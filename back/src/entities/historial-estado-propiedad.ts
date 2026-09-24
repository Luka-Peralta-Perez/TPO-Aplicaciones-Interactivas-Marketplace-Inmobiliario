import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "./propiedad";
import { EstadoPropiedad } from "./enums";

@Entity("historial_estado_propiedad")
export class HistorialEstadoPropiedad {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: "enum", enum: EstadoPropiedad })
  estadoAnterior!: EstadoPropiedad;

  @Column({ type: "enum", enum: EstadoPropiedad })
  estadoNuevo!: EstadoPropiedad;

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
