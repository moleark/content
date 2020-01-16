import * as ejs from 'ejs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';
const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" > </head><body> <div> <h1 style="color:red; text-align: center;">[ 没有模板 ]请添加</h1> </div> </body></html>`;
const sqlForWeb = `
SELECT b.content 
    FROM webbuilder$test.tv_template b 
    WHERE b.id=
`;
// const sqlForWeb = `SELECT * FROM webbuilder$test.tv_template WHERE id=`
const sqlForMobile = `
SELECT b.contentModule
    FROM webbuilder$test.tv_template b 
    WHERE b.id=
`;


export const template = async (req: Request, resp: Response) => {
    await doTemplate(req, resp);
}

async function doTemplate(req: Request, resp: Response) {
    let userAgent = req.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        let sql: string = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new MarkdownIt({ html: true });
            let template;
            if(isMobile) {
                if(ret[0].contentModule===null) {
                    template = templet;
                } else {
                    template = ret[0].contentModule
                }

            } else {
                if(ret[0].content===null) {
                    template = templet;
                } else {
                    template = ret[0].content
                }
            }
            let data = {
                replace: mdResult(md, ''),
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