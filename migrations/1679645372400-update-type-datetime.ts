import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTypeDatetime1679645372400 implements MigrationInterface {
    name = 'updateTypeDatetime1679645372400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`football_match_schedule\` ADD \`dateValue\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP COLUMN \`startMatch\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD \`startMatch\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP COLUMN \`startMatch\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD \`startMatch\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`football_match_schedule\` DROP COLUMN \`dateValue\``);
    }

}
