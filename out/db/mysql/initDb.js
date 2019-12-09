/*
import {databaseName, createDatabase, existsDatabase, useDatabase} from './database';
import {tableDefs} from './tables';
import {procDefs} from './procs';
import {execSql, tableFromSql, tablesFromSql,
    execProc, tableFromProc, tablesFromProc,
    buildProcedureSql, buildTableSql} from './tool';
//import {buildRoot} from './buildRoot';

export async function init() {
    let tbl = await tableFromSql(existsDatabase);
    let exists = tbl[0];
    if (exists !== undefined) {
        console.log('Database already exists. Nothing to do this time.');
        return;
    }
    console.log('Start init database %s.', databaseName);
    await execSql(createDatabase);
    await execSql(useDatabase);
    console.log('Database %s created.', databaseName);

    for (let i in tableDefs) {
        let tbl = tableDefs[i];
        let sql = buildTableSql(tbl);
        await execSql(sql).then(v => {
            console.log('succeed: ' + tbl.name);
        }).catch(reason => {
            console.log('error: ' + tbl.name);
            console.log(reason);
        });
    }

    for (let i in procDefs) {
        let proc = procDefs[i];
        console.log('CREATE PROCEDURE ' + proc.name);
        let sql = buildProcedureSql(proc);
        await execSql(sql).then(v => {
        }).catch(reason => {
            console.log(reason);
        });
    }
}
*/ 
//# sourceMappingURL=initDb.js.map