import { createPool } from 'mysql';
import config from 'config';
const mysqlConfig = config.get("connection");
const pool = createPool(mysqlConfig);
const databaseName = config.get<string>('database');

function buildCall(proc: string, values?: any[]) {
    let ret = 'call `' + databaseName + '`.`' + proc + '`(';
    if (values !== undefined) {
        ret += values.map(v => '?').join(',');
    }
    return ret + ');';
}

export interface Field {
    name: string;
}

export interface Index {
    name: string;
}

interface TableBase {
    name: string;
}

export interface Table extends TableBase {
    code?: string[];
}

export interface TableEx extends TableBase {
    fields: Field[];
    key: Index;
    indexes: Index[];
}

export interface Procedure {
    name: string;
    params?: string[];
    label?: string;
    returns?: string;
    code: string;
}

export async function execSql(sql: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve(result);
        })
    });
}

export async function tableFromSql(sql: string, values?: any[]): Promise<any[]> {
    let res = await execSql(sql)
    if (Array.isArray(res) === false) return [];
    if (res.length === 0) return [];
    let row0 = res[0];
    if (Array.isArray(row0)) return row0;
    return res;
}

export async function tablesFromSql(sql: string, values?: any[]): Promise<any[]> {
    return await execSql(sql);
}

export async function execProc(proc: string, values?: any[]): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
        let sql = buildCall(proc, values);
        pool.query(sql, values, (err, result) => {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve(result);
        })
    });
}

export async function tableFromProc(proc: string, values?: any[]): Promise<any[]> {
    let res = await execProc(proc, values);
    if (Array.isArray(res) === false) return [];
    switch (res.length) {
        case 0: return [];
        default: return res[0];
    }
}

export async function tablesFromProc(proc: string, values?: any[]): Promise<any[][]> {
    return await execProc(proc, values);
}

export function buildProcedureSql(proc: Procedure): string {
    let { name, params, label, code, returns } = proc;
    let ret = 'CREATE ';
    ret += returns === undefined ? 'PROCEDURE ' : 'FUNCTION ';
    ret += name + ' (';
    if (params !== undefined) ret += params.join(',');
    ret += ')\n';
    if (returns !== undefined) ret += "RETURNS " + returns + "\n";

    if (label !== undefined) ret += label + ': ';
    ret += 'BEGIN \n';
    ret += code;
    ret += '\nEND\n';
    return ret;
}

export function buildTableSql(tbl: Table): string {
    let ret = 'CREATE TABLE IF NOT EXISTS ' + tbl.name + ' (';
    ret += (tbl.code as string[]).join(',');
    ret += ');\n';
    return ret;
}
