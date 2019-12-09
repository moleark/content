import config from 'config';

/*
export const databaseName = config.get<string>("database");

export const existsDatabase = 'SELECT SCHEMA_NAME as sname \
    FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \''
    + databaseName + '\'';

export const createDatabase = 'CREATE DATABASE IF NOT EXISTS `'
    + databaseName
    + '` default CHARACTER SET utf8 COLLATE utf8_unicode_ci;';

export const useDatabase = 'USE `' + databaseName + '`;';

export function alterTableIncrement(tbl: string, inc: number): string {
    return `ALTER TABLE \`${databaseName}\`.\`${tbl}\` auto_increment=${inc}`
}
*/