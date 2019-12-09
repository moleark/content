"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ejs = __importStar(require("ejs"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const tool_1 = require("./db/mysql/tool");
const path = require('path');
const fs = require('fs');
const markdownIt = require('markdown-it'), md = new markdownIt();
(async function () {
    console.log(process.env.NODE_ENV);
    // 创建express服务
    let app = express_1.default();
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    // 使用 body-parser 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors_1.default());
    app.set('json replacer', (key, value) => {
        if (value === null)
            return undefined;
        return value;
    });
    //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
    app.use(express_1.default.static(__dirname + "/public"));
    // 或者以下这个也可以
    // app.use(express.static(path.join(__dirname, 'public'), {maxAge: 36000}));
    //设置模板视图的目录
    app.set("views", "./public/views");
    //设置是否启用视图编译缓存，启用将加快服务器执行效率
    app.set("view cache", true);
    // 2.注册html模板引擎：
    //app.engine('html', ejs.);
    //设置模板引擎的格式即运用何种模板引擎
    app.set("view engine", "html");
    app.use('/hello', async (req, resp) => {
        let ret = await tool_1.tableFromSql("select * from salestask$test.tv_mycustomer limit 10;");
        let html = '<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>';
        /**
        ret.forEach(function (item) {
            html += ejs.render('<div>dddd data <%= a %></div> <%- content %> <%= name %>', { a: 2, content: '<h1>Hello</h1>', name: item.mobile });
        });
        **/
        let content = "# Hello I am markdown \n # 一级标题 \n ## 二级标题 \n ### 三级标题";
        var mdresult = md.render(content);
        let result = ejs.render(html, { title: '模板页面', content: mdresult });
        resp.end(result);
    });
    app.use('/markdown', async (req, resp) => {
        let html = '<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>';
        fs.readFile("../contentmanagement/ts/dome.md", 'utf8', (err, data) => {
            if (err)
                return;
            else {
                let mdresult = md.render(data);
                let result = ejs.render(html, { title: '模板页面', content: mdresult });
                resp.end(result);
            }
        });
    });
    // 监听服务
    let port = config_1.default.get('port');
    app.listen(port, async () => {
        console.log('J&K website on port ' + port);
    });
})();
//# sourceMappingURL=index.js.map