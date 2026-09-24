import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1789591183432 implements MigrationInterface {
    name = 'Inicial1789591183432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vendedores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombreCompleto" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "hashContrasena" character varying(255) NOT NULL, "telefono" character varying(40), "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99ecab2651262e65f0135824de2" UNIQUE ("email"), CONSTRAINT "PK_a6b6552f1f5cdae92c9f14e2025" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inmobiliarias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(120) NOT NULL, "descripcion" text NOT NULL, "logoUrl" character varying(500), "telefonoContacto" character varying(40) NOT NULL, "emailContacto" character varying(255) NOT NULL, "direccionOficina" character varying(255), "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "vendedor_id" uuid NOT NULL, CONSTRAINT "UQ_1565262af1dbb909a4563ace7fe" UNIQUE ("nombre"), CONSTRAINT "REL_2a649e33bddeece52b4128e8a2" UNIQUE ("vendedor_id"), CONSTRAINT "PK_df26aa4549df1dec6d972a0e9f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_tipo_enum" AS ENUM('CASA', 'DEPARTAMENTO', 'TERRENO', 'LOCAL')`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_operacion_enum" AS ENUM('VENTA', 'ALQUILER')`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_estado_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TABLE "propiedades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying(160) NOT NULL, "descripcion" text NOT NULL, "tipo" "public"."propiedades_tipo_enum" NOT NULL, "operacion" "public"."propiedades_operacion_enum" NOT NULL, "precio" numeric(14,2) NOT NULL, "moneda" character varying(3) NOT NULL, "direccion" character varying(255) NOT NULL, "zona" character varying(120) NOT NULL, "superficieCubiertaM2" numeric(10,2), "superficieTotalM2" numeric(10,2) NOT NULL, "ambientes" smallint, "dormitorios" smallint, "banios" smallint, "antiguedadAnios" smallint, "etiquetas" text NOT NULL DEFAULT '', "estado" "public"."propiedades_estado_enum" NOT NULL DEFAULT 'BORRADOR', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "inmobiliaria_id" uuid NOT NULL, CONSTRAINT "PK_ee3a1dc8c0d17c197d54bc2ff37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."historial_estado_propiedad_estadoanterior_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TYPE "public"."historial_estado_propiedad_estadonuevo_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TABLE "historial_estado_propiedad" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "estadoAnterior" "public"."historial_estado_propiedad_estadoanterior_enum" NOT NULL, "estadoNuevo" "public"."historial_estado_propiedad_estadonuevo_enum" NOT NULL, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "propiedad_id" uuid NOT NULL, CONSTRAINT "PK_7a55cca88732d6a92192133c200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inmobiliarias" ADD CONSTRAINT "FK_2a649e33bddeece52b4128e8a27" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_424983c23f8fa62f30b7fac9dfc" FOREIGN KEY ("inmobiliaria_id") REFERENCES "inmobiliarias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_estado_propiedad" ADD CONSTRAINT "FK_e9da19f8385569062e57ebe4cc0" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historial_estado_propiedad" DROP CONSTRAINT "FK_e9da19f8385569062e57ebe4cc0"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_424983c23f8fa62f30b7fac9dfc"`);
        await queryRunner.query(`ALTER TABLE "inmobiliarias" DROP CONSTRAINT "FK_2a649e33bddeece52b4128e8a27"`);
        await queryRunner.query(`DROP TABLE "historial_estado_propiedad"`);
        await queryRunner.query(`DROP TYPE "public"."historial_estado_propiedad_estadonuevo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."historial_estado_propiedad_estadoanterior_enum"`);
        await queryRunner.query(`DROP TABLE "propiedades"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_operacion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "inmobiliarias"`);
        await queryRunner.query(`DROP TABLE "vendedores"`);
    }

}
