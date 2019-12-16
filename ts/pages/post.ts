import * as ejs from 'ejs';
import { Request, Response } from "express";
import fs from "fs";
import MarkdownIt from 'markdown-it';
import { tableFromSql } from '../db/mysql/tool';

export const post = async (req: Request, resp: Response) => {
    if (req.query.param) {
        let queryparam: string = req.query.param;
        const ret = await tableFromSql(`SELECT * FROM webbuilder$test.tv_post WHERE id=${queryparam}`);
        if (ret.length > 0) {
            let md = new MarkdownIt();
            let { content, template } = ret[0];
            let data = {
                title: '模板页面',
                content: content, // mdResult(md, msqContent), 
                //headerContent: mdResult(md, headerContent), 
                //img: mdResult(md, img) 
            };
            let result = ejs.render('<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><body><%= content %></body></html>', data);
            resp.end(result);
        } else {
            resp.redirect("/b")
        }
    } else {
        resp.redirect("/b")
    }
}