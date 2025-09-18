import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV421758209199879 implements MigrationInterface {
    name = 'MigrationV421758209199879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" DROP CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c"`);
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_a004a09aec816fc731289b93e8f"`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" ADD CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_a004a09aec816fc731289b93e8f" FOREIGN KEY ("productPersonalizationId") REFERENCES "ProductPersonalization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_a004a09aec816fc731289b93e8f"`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" DROP CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c"`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_a004a09aec816fc731289b93e8f" FOREIGN KEY ("productPersonalizationId") REFERENCES "ProductPersonalization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" ADD CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
