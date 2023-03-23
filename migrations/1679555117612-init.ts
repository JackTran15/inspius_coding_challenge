import { MigrationInterface, QueryRunner } from "typeorm";

export class init1679555117612 implements MigrationInterface {
    name = 'init1679555117612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tournament\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`name\` varchar(255) NOT NULL, \`start\` timestamp NOT NULL, \`matchesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`football_team\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`name\` varchar(255) NOT NULL, \`logoName\` text NOT NULL, \`logoSrc\` text NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`football_match\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedBy\` varchar(255) NOT NULL DEFAULT 'Admin', \`scoreHome\` int NOT NULL DEFAULT '0', \`scoreAway\` int NOT NULL DEFAULT '0', \`startMatch\` datetime NOT NULL, \`day\` int NOT NULL, \`month\` int NOT NULL, \`year\` int NOT NULL, \`status\` enum ('pending', 'live', 'ff') NOT NULL DEFAULT 'pending', \`tournament_id\` int NOT NULL, \`home_team_id\` int NOT NULL, \`away_team_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tournament_teams_football_team\` (\`tournamentId\` int NOT NULL, \`footballTeamId\` int NOT NULL, INDEX \`IDX_12b1d5e8a78fb21fc7ce909f6f\` (\`tournamentId\`), INDEX \`IDX_86d0d60ba941155c2f7dfc32ad\` (\`footballTeamId\`), PRIMARY KEY (\`tournamentId\`, \`footballTeamId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tournament\` ADD CONSTRAINT \`FK_7392c939ea0de0c82a852c09693\` FOREIGN KEY (\`matchesId\`) REFERENCES \`football_match\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD CONSTRAINT \`FK_0a00d63f46ad1c7cb8ab7204f78\` FOREIGN KEY (\`tournament_id\`) REFERENCES \`tournament\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD CONSTRAINT \`FK_037cb96cf22455075fec67c7fb7\` FOREIGN KEY (\`home_team_id\`) REFERENCES \`football_team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`football_match\` ADD CONSTRAINT \`FK_517e2b5b2debd7a8d29177b8a1d\` FOREIGN KEY (\`away_team_id\`) REFERENCES \`football_team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tournament_teams_football_team\` ADD CONSTRAINT \`FK_12b1d5e8a78fb21fc7ce909f6fe\` FOREIGN KEY (\`tournamentId\`) REFERENCES \`tournament\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tournament_teams_football_team\` ADD CONSTRAINT \`FK_86d0d60ba941155c2f7dfc32adc\` FOREIGN KEY (\`footballTeamId\`) REFERENCES \`football_team\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tournament_teams_football_team\` DROP FOREIGN KEY \`FK_86d0d60ba941155c2f7dfc32adc\``);
        await queryRunner.query(`ALTER TABLE \`tournament_teams_football_team\` DROP FOREIGN KEY \`FK_12b1d5e8a78fb21fc7ce909f6fe\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP FOREIGN KEY \`FK_517e2b5b2debd7a8d29177b8a1d\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP FOREIGN KEY \`FK_037cb96cf22455075fec67c7fb7\``);
        await queryRunner.query(`ALTER TABLE \`football_match\` DROP FOREIGN KEY \`FK_0a00d63f46ad1c7cb8ab7204f78\``);
        await queryRunner.query(`ALTER TABLE \`tournament\` DROP FOREIGN KEY \`FK_7392c939ea0de0c82a852c09693\``);
        await queryRunner.query(`DROP INDEX \`IDX_86d0d60ba941155c2f7dfc32ad\` ON \`tournament_teams_football_team\``);
        await queryRunner.query(`DROP INDEX \`IDX_12b1d5e8a78fb21fc7ce909f6f\` ON \`tournament_teams_football_team\``);
        await queryRunner.query(`DROP TABLE \`tournament_teams_football_team\``);
        await queryRunner.query(`DROP TABLE \`football_match\``);
        await queryRunner.query(`DROP TABLE \`football_team\``);
        await queryRunner.query(`DROP TABLE \`tournament\``);
    }

}