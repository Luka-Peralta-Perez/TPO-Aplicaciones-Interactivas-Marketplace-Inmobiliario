import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vendedor } from "./vendedor";
import { Resenia } from "./resenia";
import { Propiedad } from "./propiedad";

@Entity("inmobiliarias")
export class Inmobiliaria {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true, length: 120 })
  nombre!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "varchar", nullable: true, length: 500 })
  logoUrl!: string | null;

  @Column({ length: 40 })
  telefonoContacto!: string;

  @Column({ length: 255 })
  emailContacto!: string;

  @Column({ type: "varchar", nullable: true, length: 255 })
  direccionOficina!: string | null;

  @OneToOne(() => Vendedor, { 
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE", 
  })
  @JoinColumn({ name: "vendedor_id" })
  vendedor!: Vendedor;

  @OneToMany(() => Propiedad, (propiedad) => propiedad.inmobiliaria)
  propiedades!: Propiedad[];

  @OneToMany(() => Resenia, (resenia) => resenia.inmobiliaria)
  resenias!: Resenia[];

  @CreateDateColumn()
  creadoEn!: Date;
}
