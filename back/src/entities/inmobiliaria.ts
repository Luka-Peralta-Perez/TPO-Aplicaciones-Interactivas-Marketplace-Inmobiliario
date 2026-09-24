import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vendedor } from "./vendedor";

@Entity("inmobiliarias")
export class Inmobiliaria {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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

  @OneToOne(() => Vendedor, { nullable: false })
  @JoinColumn({ name: "vendedor_id" })
  vendedor!: Vendedor;

  @CreateDateColumn()
  creadoEn!: Date;
}
