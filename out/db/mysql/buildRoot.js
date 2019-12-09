/*
import * as config from 'config';
import {execSql, tableFromSql, tablesFromSql,
    execProc, tableFromProc, tablesFromProc} from './tool';

interface Hao {
    name: string;
    discription: string;
    url: string;
}

export async function buildRoot() {
    let tblRootUser = await tableFromProc('root_init');
    let obj = tblRootUser[0];
    let {user, unit} = obj;
    console.log('Root user=%d, unit=%d', user, unit);
    
    let haos = config.get<Hao[]>('rootHao');
    for (let hao of haos) {
        let {name, discription, url} = hao;
        console.log('root hao: %s %s %s', name, discription, url);
        await execProc('root_app_save', [unit, name, discription, url]);
    }
    let sysHao = config.get<Hao>('rootSysHao');
    console.log('root hao: %s %s %s', sysHao.name, sysHao.discription, sysHao.url);
    let tblSysHao = await tableFromProc('hao_root_save', [unit, sysHao.name, sysHao.discription, sysHao.url]);

    let hao = tblSysHao[0].hao;
    console.log('root tie: user=%s, hao=%s', user, hao);
    await execProc('tie_root_save', [user, hao]);
}

*/
//# sourceMappingURL=buildRoot.js.map