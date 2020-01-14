import * as ejs from 'ejs';
import fs from 'fs';
import { Request, Response } from "express";
import { tableFromSql } from '../db/mysql/tool';
import MarkdownIt from 'markdown-it';

const sqlForWeb = `
SELECT a.content, a.caption, b.content as template, c.path as image
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
        left join webbuilder$test.tv_image c on a.image=c.id
    WHERE a.id=
`;
const sqlForMobile = `
SELECT a.content, a.caption, b.content_mobile as template
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;

export const postM = async (req: Request, resp: Response) => {
    await doPost(req, resp, 'mobile');
}

export const postW = async (req: Request, resp: Response) => {
    await doPost(req, resp, 'web');
}

export const post = async (req: Request, resp: Response) => {
    await doPost(req, resp, 'auto');
}

const getIp = function(req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if(ip.split(',').length>0){
      ip = ip.split(',')[0];
    }
    return ip;
  };


async function doPost(req: Request, resp: Response, type: 'web' | 'mobile' | 'auto') {
    let userAgent = req.headers['user-agent'];
    let isMobile = userAgent?.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    let userIp =  getIp(req);
    if (id) {
        let sql: string;
        switch (type) {
            case 'auto': sql = isMobile ? sqlForMobile : sqlForWeb; break;
            case 'web': sql = sqlForWeb; break;
            case 'mobile': sql = sqlForMobile; break;
        }
        const ret = await tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new MarkdownIt({ html: true });
            let { content, caption, template, image } = ret[0];
            if (template == null) resp.redirect("/err");
            await tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPOST\t${userIp}\t\n')`);
            let data = {
                icon_image: image,
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