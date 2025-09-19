import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV431758309288522 implements MigrationInterface {
    name = 'MigrationV431758309288522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_a004a09aec816fc731289b93e8f"`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_a004a09aec816fc731289b93e8f" FOREIGN KEY ("productPersonalizationId") REFERENCES "ProductPersonalization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_a004a09aec816fc731289b93e8f"`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_a004a09aec816fc731289b93e8f" FOREIGN KEY ("productPersonalizationId") REFERENCES "ProductPersonalization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
