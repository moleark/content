import * as ejs from 'ejs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';
import { info } from './../../logs/logger';

const sqlForWeb = `
SELECT a.content, a.caption, b.content as template, c.path as image
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
        left join webbuilder$test.tv_image c on a.image=c.id
    WHERE a.id=
`;
const sqlForMobile = `
SELECT a.content, a.caption, b.contentModule as template
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;


export const post = async (req: Request, resp: Response) => {
    await doPost(req, resp);
}

async function doPost(req: Request, resp: Response) {
    info(req.headers);

    let userAgent = req.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        let sql: string = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new MarkdownIt({ html: true });
            let { content, template } = ret[0];
            if (template == null) resp.redirect("/err");
            await tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPOST\t${req.ip}\t\n')`);
            let data = {
                replace: mdResult(md, content),
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
    return md.render(content);
}