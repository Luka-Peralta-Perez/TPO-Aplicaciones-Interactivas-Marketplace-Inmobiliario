import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vendedores")
export class Vendedor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 120 })
  nombreCompleto!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  hashContrasena!: string;

  @Column({ type: "varchar", nullable: true, length: 40 })
  telefono!: string | null;

  @CreateDateColumn()
  creadoEn!: Date;
}
