import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1790224643429 implements MigrationInterface {
    name = 'Inicial1790224643429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resenias" ("id" SERIAL NOT NULL, "nombreAutor" character varying(120) NOT NULL, "contenido" text NOT NULL, "calificacion" smallint NOT NULL, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "inmobiliaria_id" integer NOT NULL, CONSTRAINT "PK_ecd5affcc83b6ea18fbbc017a0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comentarios" ("id" SERIAL NOT NULL, "nombreAutor" character varying(120) NOT NULL, "contenido" text NOT NULL, "respuesta" text, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "propiedad_id" integer NOT NULL, CONSTRAINT "PK_b60b1468bb275db8d5e875c4a78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."solicitudes_visita_estado_enum" AS ENUM('PENDIENTE', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'RECHAZADA')`);
        await queryRunner.query(`CREATE TABLE "solicitudes_visita" ("id" SERIAL NOT NULL, "nombreSolicitante" character varying(120) NOT NULL, "telefono" character varying(40) NOT NULL, "fechaPropuesta" TIMESTAMP NOT NULL, "mensaje" text, "estado" "public"."solicitudes_visita_estado_enum" NOT NULL DEFAULT 'PENDIENTE', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "propiedad_id" integer NOT NULL, CONSTRAINT "PK_ba70769658d7001eace792faab4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."historial_estado_propiedad_estadoanterior_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TYPE "public"."historial_estado_propiedad_estadonuevo_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TABLE "historial_estado_propiedad" ("id" SERIAL NOT NULL, "estadoAnterior" "public"."historial_estado_propiedad_estadoanterior_enum" NOT NULL, "estadoNuevo" "public"."historial_estado_propiedad_estadonuevo_enum" NOT NULL, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "propiedad_id" integer NOT NULL, CONSTRAINT "PK_7a55cca88732d6a92192133c200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_tipo_enum" AS ENUM('CASA', 'DEPARTAMENTO', 'TERRENO', 'LOCAL')`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_operacion_enum" AS ENUM('VENTA', 'ALQUILER')`);
        await queryRunner.query(`CREATE TYPE "public"."propiedades_estado_enum" AS ENUM('BORRADOR', 'PUBLICADA', 'RESERVADA', 'PAUSADA', 'VENDIDA', 'ALQUILADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TABLE "propiedades" ("id" SERIAL NOT NULL, "titulo" character varying(160) NOT NULL, "descripcion" text NOT NULL, "tipo" "public"."propiedades_tipo_enum" NOT NULL, "operacion" "public"."propiedades_operacion_enum" NOT NULL, "precio" numeric(14,2) NOT NULL, "moneda" character varying(3) NOT NULL, "direccion" character varying(255) NOT NULL, "zona" character varying(120) NOT NULL, "superficieCubiertaM2" numeric(10,2), "superficieTotalM2" numeric(10,2) NOT NULL, "ambientes" smallint, "dormitorios" smallint, "banios" smallint, "antiguedadAnios" smallint, "amenities" text NOT NULL DEFAULT '', "estado" "public"."propiedades_estado_enum" NOT NULL DEFAULT 'BORRADOR', "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "actualizadoEn" TIMESTAMP NOT NULL DEFAULT now(), "inmobiliaria_id" integer NOT NULL, CONSTRAINT "PK_ee3a1dc8c0d17c197d54bc2ff37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inmobiliarias" ("id" SERIAL NOT NULL, "nombre" character varying(120) NOT NULL, "descripcion" text NOT NULL, "logoUrl" character varying(500), "telefonoContacto" character varying(40) NOT NULL, "emailContacto" character varying(255) NOT NULL, "direccionOficina" character varying(255), "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "vendedor_id" integer NOT NULL, CONSTRAINT "UQ_1565262af1dbb909a4563ace7fe" UNIQUE ("nombre"), CONSTRAINT "REL_2a649e33bddeece52b4128e8a2" UNIQUE ("vendedor_id"), CONSTRAINT "PK_df26aa4549df1dec6d972a0e9f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendedores" ("id" SERIAL NOT NULL, "nombreCompleto" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "hashContrasenia" character varying(255) NOT NULL, "telefono" character varying(40), "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99ecab2651262e65f0135824de2" UNIQUE ("email"), CONSTRAINT "PK_a6b6552f1f5cdae92c9f14e2025" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."actividades_tipo_enum" AS ENUM('COMENTARIO', 'SOLICITUD_VISITA', 'CAMBIO_ESTADO_PROPIEDAD', 'RESENA')`);
        await queryRunner.query(`CREATE TABLE "actividades" ("id" SERIAL NOT NULL, "tipo" "public"."actividades_tipo_enum" NOT NULL, "referenciaOrigen" integer NOT NULL, "leida" boolean NOT NULL DEFAULT false, "creadoEn" TIMESTAMP NOT NULL DEFAULT now(), "inmobiliaria_id" integer NOT NULL, CONSTRAINT "PK_03490866fef1c23456f0e289d9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "resenias" ADD CONSTRAINT "FK_fd9e236e300c5132479735b43e9" FOREIGN KEY ("inmobiliaria_id") REFERENCES "inmobiliarias"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comentarios" ADD CONSTRAINT "FK_71d6c7fe4b4cafbaffb5fb5f999" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "solicitudes_visita" ADD CONSTRAINT "FK_df92e2e5e0f6162c81b0e34f289" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "historial_estado_propiedad" ADD CONSTRAINT "FK_e9da19f8385569062e57ebe4cc0" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_424983c23f8fa62f30b7fac9dfc" FOREIGN KEY ("inmobiliaria_id") REFERENCES "inmobiliarias"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inmobiliarias" ADD CONSTRAINT "FK_2a649e33bddeece52b4128e8a27" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "actividades" ADD CONSTRAINT "FK_3bbf7210b1ee78b3b4524147a66" FOREIGN KEY ("inmobiliaria_id") REFERENCES "inmobiliarias"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actividades" DROP CONSTRAINT "FK_3bbf7210b1ee78b3b4524147a66"`);
        await queryRunner.query(`ALTER TABLE "inmobiliarias" DROP CONSTRAINT "FK_2a649e33bddeece52b4128e8a27"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_424983c23f8fa62f30b7fac9dfc"`);
        await queryRunner.query(`ALTER TABLE "historial_estado_propiedad" DROP CONSTRAINT "FK_e9da19f8385569062e57ebe4cc0"`);
        await queryRunner.query(`ALTER TABLE "solicitudes_visita" DROP CONSTRAINT "FK_df92e2e5e0f6162c81b0e34f289"`);
        await queryRunner.query(`ALTER TABLE "comentarios" DROP CONSTRAINT "FK_71d6c7fe4b4cafbaffb5fb5f999"`);
        await queryRunner.query(`ALTER TABLE "resenias" DROP CONSTRAINT "FK_fd9e236e300c5132479735b43e9"`);
        await queryRunner.query(`DROP TABLE "actividades"`);
        await queryRunner.query(`DROP TYPE "public"."actividades_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "vendedores"`);
        await queryRunner.query(`DROP TABLE "inmobiliarias"`);
        await queryRunner.query(`DROP TABLE "propiedades"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_operacion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "historial_estado_propiedad"`);
        await queryRunner.query(`DROP TYPE "public"."historial_estado_propiedad_estadonuevo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."historial_estado_propiedad_estadoanterior_enum"`);
        await queryRunner.query(`DROP TABLE "solicitudes_visita"`);
        await queryRunner.query(`DROP TYPE "public"."solicitudes_visita_estado_enum"`);
        await queryRunner.query(`DROP TABLE "comentarios"`);
        await queryRunner.query(`DROP TABLE "resenias"`);
    }

}
