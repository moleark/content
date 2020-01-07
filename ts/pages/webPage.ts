import * as ejs from 'ejs';
import fs from 'fs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';

// call webbuilder$test.tv_addbrowsinghistory (24,47,'1\tPOST\t211.5.4.7\t\n');

const addbrowsinghistory = `
    call webbuilder$test.tv_addbrowsinghistory (24,47,'1\tPOST\t211.5.4.7\t\n');
`;

const sqlForWeb = `
    SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

const sqlForWebBrand = `
    SELECT  a.webpage, a.branch, b.content as branch
    FROM    webbuilder$test.tv_webpagebranch a 
            left join webbuilder$test.tv_branch b on a.branch=b.id 
    WHERE a.webpage=
`;
const sqlForMobile = `
SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

// export const postM = async (req: Request, resp: Response) => {
//     await doPost(req, resp, 'mobile');
// }

// export const postW = async (req: Request, resp: Response) => {
//     await doPost(req, resp, 'web');
// }

export const webpage = async (req: Request, resp: Response) => {
    await doPost(req, resp, 'auto');
}

async function doPost(req: Request, resp: Response, type: 'auto') {
    let userAgent = req.headers['user-agent'];
    let isMobile = userAgent?.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    console.log(req.ip)
    if (id) {
        let sql: string;
        switch (type) {
            case 'auto': sql = isMobile ? sqlForMobile : sqlForWeb; break;
        }
        const ret = await tableFromSql(sql + id);
        const contenta = await tableFromSql(sqlForWebBrand + id);
        // console.log(contenta,'ret')
        if (ret.length > 0) {
            let md = new MarkdownIt({ html: true });
            let { content, titel, template, name } = ret[0];
            if (template == null) resp.redirect("/err");
            let data = {
                title: titel,
                content: contenta[0].branch,
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