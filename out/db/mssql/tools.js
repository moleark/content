"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = __importStar(require("mssql"));
const connection_1 = require("./connection");
//import { init } from 'uq-joint/db/mysql/initDb';
let __pool;
async function initMssqlPool() {
    __pool = await new mssql.ConnectionPool(connection_1.conn).connect();
}
exports.initMssqlPool = initMssqlPool;
/*
async function getPool() {
    if (__pool === undefined) {
        return __pool = await new mssql.ConnectionPool(conn).connect();
    }
    else {
        return __pool;
    }

}
*/
async function execSql(sql, params) {
    try {
        const request = __pool.request();
        if (params !== undefined) {
            for (let p of params) {
                let { name, value } = p;
                request.input(name, value);
            }
        }
        const result = await request.query(sql);
        return result;
    }
    catch (error) {
        // debugger;
        console.error(error + ":" + sql);
        if (error.code === 'ETIMEOUT')
            await execSql(sql, params);
        else
            throw error;
    }
}
exports.execSql = execSql;
;
//# sourceMappingURL=tools.js.map