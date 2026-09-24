import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inmobiliaria } from "./inmobiliaria";

@Entity("vendedores")
export class Vendedor {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ length: 120 })
  nombreCompleto!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  hashContrasenia!: string;

  @Column({ type: "varchar", nullable: true, length: 40 })
  telefono!: string | null;

  @OneToOne(() => Inmobiliaria, (inmobiliaria) => inmobiliaria.vendedor)
  inmobiliaria!: Inmobiliaria;

  @CreateDateColumn()
  creadoEn!: Date;
}
