//import { createDatabase, existsDatabase, useDatabase, databaseName } from './database';
/*
import { tableDefs } from './tables';
import { procDefs } from './procs';
import {
    execSql, tableFromSql,
    buildProcedureSql, buildTableSql
} from './tool';
//import {buildRoot} from './buildRoot';

export async function upgrade() {
    let sqlExists = existsDatabase;
    let tbl = await tableFromSql(sqlExists);
    let exists = tbl[0];
    if (exists === undefined) {
        await execSql(createDatabase);
        tbl = await tableFromSql(sqlExists);
        if (tbl.length === 0) {
            console.log('Database not inited. Nothing to do this time.');
            return;
        }
    }
    console.log('Start upgrade database %s', databaseName);
    await execSql(useDatabase);

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
        let pName = proc.name;
        let procType = proc.returns === undefined ? 'PROCEDURE' : 'FUNCTION';
        console.log('CREATE ' + procType + ' ' + pName);
        let drop = 'DROP ' + procType + ' IF EXISTS ' + pName;
        await execSql(drop);
        let sql = buildProcedureSql(proc);
        await execSql(sql).then(v => {
        }).catch(reason => {
            console.log(reason);
        });
    }

    //await buildRoot();
}
*/ 
//# sourceMappingURL=upgradeDb.js.map