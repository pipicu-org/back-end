import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV31755722511557 implements MigrationInterface {
    name = 'MigrationV31755722511557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Client" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "phoneNumber" character varying(255) NOT NULL, "facebookUsername" character varying(255), "instagramUsername" character varying(255), "address" character varying(255) NOT NULL, CONSTRAINT "UQ_9656099b1daf67b806ef17a48bc" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_48e0e5e146128a2835c4c30f4d9" UNIQUE ("facebookUsername"), CONSTRAINT "UQ_b5a49e9278d0f650f5af9913450" UNIQUE ("instagramUsername"), CONSTRAINT "PK_b79874c8d411b839b9ccc301972" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Preparation" ("id" SERIAL NOT NULL, "stateId" integer NOT NULL, CONSTRAINT "PK_43e8c92c2b498b82a7ec6b897df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TransitionType" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_c4fd5038b4585b76b4259381227" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transition" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "duration" bigint, "transitionatorId" bigint NOT NULL, "fromStateId" integer NOT NULL, "toStateId" integer NOT NULL, "transitionTypeId" integer NOT NULL, CONSTRAINT "PK_08a3810af5c5d8262f44e40cdae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "State" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_2f896ea8815d952f289ac9a562c" UNIQUE ("name"), CONSTRAINT "PK_ba7801fef9aabc0a35a0110c896" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Order" ("id" SERIAL NOT NULL, "totalPrice" numeric(10,2) NOT NULL DEFAULT '0', "deliveryTime" TIMESTAMP NOT NULL, "paymentMethod" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "stateId" integer, "clientId" integer, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Line" ("id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" integer, "productId" integer, "personalizationsId" integer, CONSTRAINT "PK_29cb58c6844e6c7387e66d7ac5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ProductPersonalization" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "lineId" integer NOT NULL, CONSTRAINT "PK_8cf8a1f1b2fd78e47c1bbc0b8a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Personalization" ("id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "note" character varying(255) NOT NULL, "productPersonalizationId" integer, "ingredientId" integer, CONSTRAINT "REL_a004a09aec816fc731289b93e8" UNIQUE ("productPersonalizationId"), CONSTRAINT "REL_9b4161fef97887c477c32d8521" UNIQUE ("ingredientId"), CONSTRAINT "PK_a66052e14781ebce10c4e689cbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Ingredient" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, CONSTRAINT "UQ_ba4ca47c86130dc0f6aab876054" UNIQUE ("name"), CONSTRAINT "PK_27dd7f2af219c82bb15f2a7813e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "RecipeIngredients" ("id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "recipeId" integer, "ingredientId" integer NOT NULL, CONSTRAINT "PK_84e15860a7d7733178c6a1b5678" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Recipe" ("id" SERIAL NOT NULL, "totalPrice" numeric(10,2) NOT NULL, CONSTRAINT "PK_9505617a985aaf82e5189cbaa78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Product" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "categoryId" integer, "recipeId" integer, CONSTRAINT "REL_9b1926eb3294dd44a0b3876a70" UNIQUE ("recipeId"), CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Category" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_0ac420e8701e781dbf1231dc230" UNIQUE ("name"), CONSTRAINT "PK_c2727780c5b9b0c564c29a4977c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Preparation" ADD CONSTRAINT "FK_f020f41bf0a750d8ae1abeb1eea" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transition" ADD CONSTRAINT "FK_a53c88fdf092a1a9a97da6763d0" FOREIGN KEY ("fromStateId") REFERENCES "State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transition" ADD CONSTRAINT "FK_8891aa32933a77f4866f70f1d2a" FOREIGN KEY ("toStateId") REFERENCES "State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transition" ADD CONSTRAINT "FK_f1e0e7e244fc3b9fd5f3c5f8d3e" FOREIGN KEY ("transitionTypeId") REFERENCES "TransitionType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Order" ADD CONSTRAINT "FK_0ee04b6bf981e3cdea0d93952ae" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Order" ADD CONSTRAINT "FK_9043e6216860099ac14958ed7ee" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_667d6fb560998963fb62bfef7e7" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_7bc94a8767b78da96b406e6ed7b" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Line" ADD CONSTRAINT "FK_415cd44ef3f0f94c170388ec383" FOREIGN KEY ("personalizationsId") REFERENCES "ProductPersonalization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" ADD CONSTRAINT "FK_4f9f55ec8f1a981b15cc0d0b268" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" ADD CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_a004a09aec816fc731289b93e8f" FOREIGN KEY ("productPersonalizationId") REFERENCES "ProductPersonalization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Personalization" ADD CONSTRAINT "FK_9b4161fef97887c477c32d8521a" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "FK_e7e7d82d700477638b0b80bb06c" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "FK_d78bb7582394a284756a0fc9e55" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_896e2e0f6dfa6f80117a79e1d7e" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_9b1926eb3294dd44a0b3876a70c" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_9b1926eb3294dd44a0b3876a70c"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_896e2e0f6dfa6f80117a79e1d7e"`);
        await queryRunner.query(`ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "FK_d78bb7582394a284756a0fc9e55"`);
        await queryRunner.query(`ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "FK_e7e7d82d700477638b0b80bb06c"`);
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_9b4161fef97887c477c32d8521a"`);
        await queryRunner.query(`ALTER TABLE "Personalization" DROP CONSTRAINT "FK_a004a09aec816fc731289b93e8f"`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" DROP CONSTRAINT "FK_1527b5aacda7fe4b1f2b661cf3c"`);
        await queryRunner.query(`ALTER TABLE "ProductPersonalization" DROP CONSTRAINT "FK_4f9f55ec8f1a981b15cc0d0b268"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_415cd44ef3f0f94c170388ec383"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_7bc94a8767b78da96b406e6ed7b"`);
        await queryRunner.query(`ALTER TABLE "Line" DROP CONSTRAINT "FK_667d6fb560998963fb62bfef7e7"`);
        await queryRunner.query(`ALTER TABLE "Order" DROP CONSTRAINT "FK_9043e6216860099ac14958ed7ee"`);
        await queryRunner.query(`ALTER TABLE "Order" DROP CONSTRAINT "FK_0ee04b6bf981e3cdea0d93952ae"`);
        await queryRunner.query(`ALTER TABLE "Transition" DROP CONSTRAINT "FK_f1e0e7e244fc3b9fd5f3c5f8d3e"`);
        await queryRunner.query(`ALTER TABLE "Transition" DROP CONSTRAINT "FK_8891aa32933a77f4866f70f1d2a"`);
        await queryRunner.query(`ALTER TABLE "Transition" DROP CONSTRAINT "FK_a53c88fdf092a1a9a97da6763d0"`);
        await queryRunner.query(`ALTER TABLE "Preparation" DROP CONSTRAINT "FK_f020f41bf0a750d8ae1abeb1eea"`);
        await queryRunner.query(`DROP TABLE "Category"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TABLE "Recipe"`);
        await queryRunner.query(`DROP TABLE "RecipeIngredients"`);
        await queryRunner.query(`DROP TABLE "Ingredient"`);
        await queryRunner.query(`DROP TABLE "Personalization"`);
        await queryRunner.query(`DROP TABLE "ProductPersonalization"`);
        await queryRunner.query(`DROP TABLE "Line"`);
        await queryRunner.query(`DROP TABLE "Order"`);
        await queryRunner.query(`DROP TABLE "State"`);
        await queryRunner.query(`DROP TABLE "Transition"`);
        await queryRunner.query(`DROP TABLE "TransitionType"`);
        await queryRunner.query(`DROP TABLE "Preparation"`);
        await queryRunner.query(`DROP TABLE "Client"`);
    }

}
