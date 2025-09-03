import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV411756862065534 implements MigrationInterface {
    name = 'MigrationV411756862065534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_667d6fb560998963fb62bfef7e7"`);
        await queryRunner.query(`ALTER TABLE "Line" ADD "preparationId" integer`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "UQ_7100f6e0ae4f188cae970898120" UNIQUE ("preparationId")`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_667d6fb560998963fb62bfef7e7" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_7100f6e0ae4f188cae970898120" FOREIGN KEY ("preparationId") REFERENCES "Preparation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_7100f6e0ae4f188cae970898120"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_667d6fb560998963fb62bfef7e7"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "UQ_7100f6e0ae4f188cae970898120"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP COLUMN "preparationId"`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_667d6fb560998963fb62bfef7e7" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
