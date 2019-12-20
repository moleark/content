import * as ejs from 'ejs';
import fs from 'fs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';

export const post = async (req: Request, resp: Response) => {
    let id = req.params['id'];
    if (id) {
        const ret = await tableFromSql(`SELECT a.content, a.caption, b.content as template FROM webbuilder$test.tv_post a left join webbuilder$test.tv_template b on a.template=b.id WHERE a.id=${id}`);
        if (ret.length > 0) {
            let { content, caption, template } = ret[0];
            let data = {
                title: caption,
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