import * as ejs from 'ejs';
import { Request, Response } from "express";
import { tableFromSql } from "../db/mysql/tool";
import MarkdownIt from "markdown-it";

const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>`;
const content = `# Hello I am markdown \n # 一级标题 \n ## 二级标题 \n ### 三级标题`

export const hello = async (req: Request, resp: Response) => {
    let ret = await tableFromSql("select * from salestask$test.tv_mycustomer limit 10;");
    /**
    ret.forEach(function (item) {
        html += ejs.render('<div>dddd data <%= a %></div> <%- content %> <%= name %>', { a: 2, content: '<h1>Hello</h1>', name: item.mobile });
    });
    **/
    let md = new MarkdownIt();
    var mdresult = md.render(content);
    let result = ejs.render(templet, { title: '模板页面', content: mdresult })
    resp.end(result);
}