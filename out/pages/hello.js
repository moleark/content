"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs = __importStar(require("ejs"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const tool_1 = require("../db/mysql/tool");
const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" > header { width: 1200px; margin: 0 auto; display: flex; } h1 {color: blue;} header img {width: 20px; height: 20px;} p { display: inline-block; margin: 0; } ul { flex: 1; list-style: none; display: flex; padding: 0; margin: 0;} li { flex: 1; text-align: center; }</style></head><body> <div> <header> <%- headerContent %> </header>  <div> <%- content %> </div> </div> </body></html>`;
//const content = ` # 一级标题 \n ## 二级标题 \n ### 三级标题 \n * 无序列表 \n 1. 有序列表 \n > 引用![Mou icon](https://oimagea5.ydstatic.com/image?id=-3026291710637413585&product=adpublish&w=520&h=347)`
const headerContent = `![Mou icon](https://oimagea5.ydstatic.com/image?id=-3026291710637413585&product=adpublish&w=520&h=347) \n * 首页 \n * 我的 \n * 商城`;
const img = `![Mou icon](https://upload.jianshu.io/admin_banners/web_images/4824/066b16f3ca11cfb4f2a47b0ecc53010e0e5e5e95.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540)`;
exports.hello = async (req, resp) => {
    if (req.query.param) {
        let queryparam = req.query.param;
        const ret = await tool_1.tableFromSql("SELECT * FROM webbuilder$test.tv_content WHERE id='" + queryparam + "' or name='" + queryparam + "'");
        if (ret.length > 0) {
            let md = new markdown_it_1.default();
            let { content } = ret[0];
            let data = {
                title: '模板页面',
                content: mdResult(md, content),
                headerContent: mdResult(md, headerContent),
                img: mdResult(md, img)
            };
            let result = ejs.render(templet, data);
            resp.end(result);
        }
        else {
            resp.redirect("/err");
        }
    }
    else {
        resp.redirect("/err");
    }
};
function mdResult(md, content) {
    return md.render(content);
}
//# sourceMappingURL=hello.js.map