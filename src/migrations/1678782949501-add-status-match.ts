import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStatusMatch1678782949501 implements MigrationInterface {
  name = 'addStatusMatch1678782949501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`football_match\` CHANGE \`start\` \`status\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`football_match\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`football_match\` ADD \`status\` enum ('pending', 'live', 'ff') NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`football_match\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`football_match\` ADD \`status\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`football_match\` CHANGE \`status\` \`start\` datetime NOT NULL`,
    );
  }
}
