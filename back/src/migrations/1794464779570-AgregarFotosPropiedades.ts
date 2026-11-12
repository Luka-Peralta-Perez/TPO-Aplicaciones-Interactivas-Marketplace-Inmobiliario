import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarFotosPropiedades1794464779570 implements MigrationInterface {
    name = 'AgregarFotosPropiedades1794464779570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "propiedades" ADD "fotos" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD "fotoPortada" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "propiedades" DROP COLUMN "fotoPortada"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP COLUMN "fotos"`);
    }

}
