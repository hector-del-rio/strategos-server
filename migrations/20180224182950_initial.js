exports.up = function (knex, Promise) {
    const createClientTable = `
        CREATE TABLE \`client\` (
          \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          \`name\` varchar(128) DEFAULT NULL,
          \`description\` text,
          \`mac\` char(17) DEFAULT NULL,
          \`ip\` char(45) DEFAULT NULL,
          \`last_contact\` datetime DEFAULT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED;
    `;
    const createTaskTable = `
        CREATE TABLE \`task\` (
          \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          \`client_id\` bigint(20) unsigned NOT NULL,
          \`status\` enum('in queue','running','done') NOT NULL DEFAULT 'in queue',
          \`command\` text,
          \`run_detached\` tinyint(1) NOT NULL DEFAULT '0',
          \`stdout\` longtext,
          \`stderr\` longtext,
          \`started_at\` datetime DEFAULT NULL,
          \`ended_at\` datetime DEFAULT NULL,
          \`exit_code\` smallint(6) DEFAULT NULL,
          \`error\` longtext,
          \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
          \`reported_at\` datetime DEFAULT NULL,
          \`creator_id\` bigint(20) DEFAULT NULL,
          \`max_run_seconds\` int(11) DEFAULT '900',
          PRIMARY KEY (\`id\`),
          KEY \`task_fk_client\` (\`client_id\`),
          CONSTRAINT \`task_fk_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`client\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPRESSED;
    `;

    return Promise.all([
        knex.raw(createClientTable),
        knex.raw(createTaskTable)
    ]);
};

exports.down = function (knex, Promise) {
    Promise.all([
        knex.raw('DROP TABLE IF EXISTS `client`'),
        knex.raw('DROP TABLE IF EXISTS `task`'),
    ]);
};
