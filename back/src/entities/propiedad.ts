import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Inmobiliaria } from "./inmobiliaria";
import { Operacion, EstadoPropiedad, TipoPropiedad } from "./enums";
import { Comentario } from "./comentario";
import { SolicitudVisita } from "./solicitud-visita";
import { HistorialEstadoPropiedad } from "./historial-estado-propiedad";

@Entity("propiedades")
export class Propiedad {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ length: 160 })
  titulo!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "enum", enum: TipoPropiedad })
  tipo!: TipoPropiedad;

  @Column({ type: "enum", enum: Operacion })
  operacion!: Operacion;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  precio!: string;

  @Column({ type: "varchar", length: 3 })
  moneda!: "ARS" | "USD";

  @Column({ length: 255 })
  direccion!: string;

  @Column({ length: 120 })
  zona!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  superficieCubiertaM2!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  superficieTotalM2!: string;

  @Column({ type: "smallint", nullable: true })
  ambientes!: number | null;

  @Column({ type: "smallint", nullable: true })
  dormitorios!: number | null;

  @Column({ type: "smallint", nullable: true })
  banios!: number | null;

  @Column({ type: "smallint", nullable: true })
  antiguedadAnios!: number | null;

  @Column({ type: "simple-array", default: "" })
  amenities!: string[];

  @Column({ type: "enum", enum: EstadoPropiedad, default: EstadoPropiedad.BORRADOR })
  estado!: EstadoPropiedad;

  @ManyToOne(() => Inmobiliaria, { 
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE", 
  })
  @JoinColumn({ name: "inmobiliaria_id" })
  inmobiliaria!: Inmobiliaria;

  @OneToMany(() => Comentario, (comentario) => comentario.propiedad)
  comentarios!: Comentario[];

  @OneToMany(() => SolicitudVisita, (solicitudVisita) => solicitudVisita.propiedad)
  solicitudesVisita!: SolicitudVisita[];

  @OneToMany(() => HistorialEstadoPropiedad, (historial) => historial.propiedad)
  historialEstados!: HistorialEstadoPropiedad[];

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
