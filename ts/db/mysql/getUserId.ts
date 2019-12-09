/*
import { databaseName } from "./database";
import { execSql } from "./tool";

export async function getUserId(webUserID: string) {
    try {
        let sql = `select id from \`${databaseName}\`.\`map_webuser\` where no='${webUserID}'`;
        let ret = await execSql(sql);
        if (ret.length === 1)
            return ret[0]['id'];
    }
    catch (err) {
        throw err;
    }
    return -1;
}

*/