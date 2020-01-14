import * as ejs from 'ejs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';

// call webbuilder$test.tv_addbrowsinghistory (24,47,'1\tPOST\t211.5.4.7\t\n');



const sqlForWebBrand = `
    SELECT  a.webpage, a.branch, b.content as branch, a.sort
    FROM    webbuilder$test.tv_webpagebranch a 
            left join webbuilder$test.tv_branch b on a.branch=b.id 
    WHERE a.webpage=
`;

const sqlForWeb = `
    SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

const sqlForMobile = `
SELECT  a.titel, a.name, b.contentModule as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

export const webpage = async (req: Request, resp: Response) => {
    await doPost(req, resp);
}

const getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    console.log(req.headers['x-real-ip']);
    return ip;
};

async function doPost(req: Request, resp: Response) {
    let userAgent = req.headers['user-agent'];
    let isMobile = userAgent?.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    let userIp = getIp(req);
    if (id) {
        let sql: string = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tableFromSql(sql + id);
        const webpageData = await tableFromSql(sqlForWebBrand + id + " order by a.sort ");
        let content = '';
        let md = new MarkdownIt({ html: true });
        if (webpageData.length >= 1) {
            webpageData.sort(function (m, n) {
                if (m.sort < n.sort) return -1
                else if (m.sort > n.sort) return 1
                else return 0
            });
            content = webpageData.map(element => {
                return mdResult(md, element.branch)
            }).join('');
        } else {
            content = mdResult(md, '内')
        }
        if (ret.length > 0) {
            await tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPAGE\t${userIp}\t\n')`);
            let { titel, template } = ret[0];
            if (template == null) resp.redirect("/err");
            let data = {
                title: titel,
                content: content,
            };
            let result = ejs.render(template, data);
            resp.end(result);
        } else {
            resp.redirect("/err")
        }
    } else {
        resp.redirect("/err")
    }
}
function mdResult(md, content) {
    return md.render(content)
}