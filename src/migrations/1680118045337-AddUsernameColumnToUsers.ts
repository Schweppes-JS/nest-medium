import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameColumnToUsers1680118045337
  implements MigrationInterface
{
  name = 'AddUsernameColumnToUsers1680118045337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
