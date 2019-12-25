import * as ejs from 'ejs';
import fs from 'fs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';

const sqlForWeb = `
SELECT a.content, a.caption, b.content as template
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
const sqlForMobile = `
SELECT a.content, a.caption, b.content_mobile as template
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

export const post = async (req: Request, resp: Response) => {
    let userAgent = req.headers['user-agent'];
    let isMobile = userAgent?.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        let sql = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new MarkdownIt({ html: true });
            let { content, caption, template } = ret[0];
            let data = {
                title: caption,
                content: mdResult(md, content),
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