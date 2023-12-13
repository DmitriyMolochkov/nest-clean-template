import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1699424461107 implements MigrationInterface {
  public name = 'CreateUsersTable1699424461107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" SERIAL NOT NULL,
            "login" character varying(64) NOT NULL,
            "password" character varying(255) NOT NULL,
            "use_ldap" boolean NOT NULL DEFAULT false,

            CONSTRAINT "PK_user" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_login" UNIQUE ("login")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
  }
}
