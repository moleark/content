import * as ejs from 'ejs';
import MarkdownIt from "markdown-it";
import { Request, Response } from "express";
import { tableFromSql } from "../db/mysql/tool";

const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" > header { width: 1200px; margin: 0 auto; display: flex; } h1 {color: blue;} header img {width: 20px; height: 20px;} p { display: inline-block; margin: 0; } ul { flex: 1; list-style: none; display: flex; padding: 0; margin: 0;} li { flex: 1; text-align: center; }</style></head><body> <div> <header> <%- headerContent %> </header>  <div> <%- content %> </div> </div> </body></html>`;
const content = ` # 一级标题 \n ## 二级标题 \n ### 三级标题 \n * 无序列表 \n 1. 有序列表 \n > 引用![Mou icon](https://oimagea5.ydstatic.com/image?id=-3026291710637413585&product=adpublish&w=520&h=347)`
const headerContent = `![Mou icon](https://oimagea5.ydstatic.com/image?id=-3026291710637413585&product=adpublish&w=520&h=347) \n * 首页 \n * 我的 \n * 商城`;
const img = `![Mou icon](https://upload.jianshu.io/admin_banners/web_images/4824/066b16f3ca11cfb4f2a47b0ecc53010e0e5e5e95.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540)`
export const hello = async (req: Request, resp: Response) => {
    if (req.query.param) {
        let queryparam: string = req.query.param;
        const ret = await tableFromSql("SELECT * FROM webbuilder$test.tv_content WHERE id='" + queryparam + "' or name='" + queryparam + "'");
        if (ret.length > 0) {
            let md = new MarkdownIt();
            let msqContent = ret[0].content
            let result = ejs.render(templet, { title: '模板页面', content: mdResult(md, msqContent), headerContent: mdResult(md, headerContent), img: mdResult(md, img) })
            resp.end(result);
        } else {
            resp.redirect("/b")
        }
    }else {
        resp.redirect("/b")
    }
}
function mdResult(md, content) {
    return md.render(content)
}
