import { MigrationInterface, QueryRunner } from "typeorm";

export class init1679644207118 implements MigrationInterface {
    name = 'init1679644207118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`football_team\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`name\` varchar(255) NOT NULL, \`logoName\` text NOT NULL, \`logoSrc\` text NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`football_match\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`scoreHome\` int NOT NULL DEFAULT '0', \`scoreAway\` int NOT NULL DEFAULT '0', \`startMatch\` date NOT NULL, \`day\` int NOT NULL, \`month\` int NOT NULL, \`year\` int NOT NULL, \`status\` enum ('pending', 'live', 'ff') NOT NULL DEFAULT 'pending', \`home_team_id\` int NOT NULL, \`away_team_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`football_match_schedule\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`day\` int NOT NULL, \`month\` int NOT NULL, \`year\` int NOT NULL, \`dateValue\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD CONSTRAINT \`FK_037cb96cf22455075fec67c7fb7\` FOREIGN KEY (\`home_team_id\`) REFERENCES \`football_team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD CONSTRAINT \`FK_517e2b5b2debd7a8d29177b8a1d\` FOREIGN KEY (\`away_team_id\`) REFERENCES \`football_team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP FOREIGN KEY \`FK_517e2b5b2debd7a8d29177b8a1d\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP FOREIGN KEY \`FK_037cb96cf22455075fec67c7fb7\``);
        await queryRunner.query(`DROP TABLE \`football_match_schedule\``);
        await queryRunner.query(`DROP TABLE \`football_match\``);
        await queryRunner.query(`DROP TABLE \`football_team\``);
    }

}
