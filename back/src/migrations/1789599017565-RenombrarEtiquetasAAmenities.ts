import { MigrationInterface, QueryRunner } from "typeorm";

export class RenombrarEtiquetasAAmenities1789599017565 implements MigrationInterface {
    name = 'RenombrarEtiquetasAAmenities1789599017565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "propiedades" RENAME COLUMN "etiquetas" TO "amenities"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "propiedades" RENAME COLUMN "amenities" TO "etiquetas"`);
    }

}
