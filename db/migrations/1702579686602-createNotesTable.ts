import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotesTable1702579686602 implements MigrationInterface {
  public name = 'CreateNotesTable1702579686602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."notes_status_enum" AS ENUM(\'active\', \'inactive\', \'expired\')');
    await queryRunner.query('CREATE TABLE "notes" ("id" SERIAL NOT NULL, "title" character varying(250) NOT NULL, "description" character varying(5000), "status" "public"."notes_status_enum" NOT NULL, "text" character varying(50000) NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "notes"');
    await queryRunner.query('DROP TYPE "public"."notes_status_enum"');
  }
}
