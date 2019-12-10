import * as ejs from 'ejs';
import { Request, Response } from "express";
import fs from "fs";
import MarkdownIt from 'markdown-it';

export const markdown = async (req: Request, resp: Response) => {
    let html = '<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>';
    fs.readFile("../contentmanagement/ts/dome.md", 'utf8', (err, data) => {
        if (err) return;
        else {
            let md = new MarkdownIt();
            let mdresult = md.render(data);
            let result = ejs.render(html, { title: '模板页面', content: mdresult });
            resp.end(result);
        }
    })
}