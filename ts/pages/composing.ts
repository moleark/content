import fs from 'fs';
import * as ejs from 'ejs';
import MarkdownIt from 'markdown-it';
import { Request, Response } from 'express';

const errContent = `# 抱歉您访问的页面不存在`;

const errImg = `![Mou icon](https://cdn2.jianshu.io/shakespeare/_next/static/images/404-203cdc8362d3b571276978d13f5ffd21.png)`

export const composing = async (req: Request, resp: Response) => {

    fs.readFile('ts/pages/templets/err.html', 'utf-8',( err, data)=>{
        if(err) {
            throw err
        } else {
            let md = new MarkdownIt();
            let mdContent = md.render(errContent);
            let mdimg = md.render(errImg);
            let result = ejs.render(data, { title: '项目ONE', content: mdContent, img: mdimg });
            resp.end(result);
        }
    });
}