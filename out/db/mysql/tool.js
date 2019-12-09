"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const config_1 = __importDefault(require("config"));
const mysqlConfig = config_1.default.get("connection");
const pool = mysql_1.createPool(mysqlConfig);
const databaseName = config_1.default.get('database');
function buildCall(proc, values) {
    let ret = 'call `' + databaseName + '`.`' + proc + '`(';
    if (values !== undefined) {
        ret += values.map(v => '?').join(',');
    }
    return ret + ');';
}
async function execSql(sql) {
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}
exports.execSql = execSql;
async function tableFromSql(sql, values) {
    let res = await execSql(sql);
    if (Array.isArray(res) === false)
        return [];
    if (res.length === 0)
        return [];
    let row0 = res[0];
    if (Array.isArray(row0))
        return row0;
    return res;
}
exports.tableFromSql = tableFromSql;
async function tablesFromSql(sql, values) {
    return await execSql(sql);
}
exports.tablesFromSql = tablesFromSql;
async function execProc(proc, values) {
    return await new Promise((resolve, reject) => {
        let sql = buildCall(proc, values);
        pool.query(sql, values, (err, result) => {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}
exports.execProc = execProc;
async function tableFromProc(proc, values) {
    let res = await execProc(proc, values);
    if (Array.isArray(res) === false)
        return [];
    switch (res.length) {
        case 0: return [];
        default: return res[0];
    }
}
exports.tableFromProc = tableFromProc;
async function tablesFromProc(proc, values) {
    return await execProc(proc, values);
}
exports.tablesFromProc = tablesFromProc;
function buildProcedureSql(proc) {
    let { name, params, label, code, returns } = proc;
    let ret = 'CREATE ';
    ret += returns === undefined ? 'PROCEDURE ' : 'FUNCTION ';
    ret += name + ' (';
    if (params !== undefined)
        ret += params.join(',');
    ret += ')\n';
    if (returns !== undefined)
        ret += "RETURNS " + returns + "\n";
    if (label !== undefined)
        ret += label + ': ';
    ret += 'BEGIN \n';
    ret += code;
    ret += '\nEND\n';
    return ret;
}
exports.buildProcedureSql = buildProcedureSql;
function buildTableSql(tbl) {
    let ret = 'CREATE TABLE IF NOT EXISTS ' + tbl.name + ' (';
    ret += tbl.code.join(',');
    ret += ');\n';
    return ret;
}
exports.buildTableSql = buildTableSql;
//# sourceMappingURL=tool.js.map