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
const tool_1 = require("../db/mysql/tool");
const markdown_it_1 = __importDefault(require("markdown-it"));
const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>`;
const content = `# Hello I am markdown \n # 一级标题 \n ## 二级标题 \n ### 三级标题`;
exports.hello = async (req, resp) => {
    let ret = await tool_1.tableFromSql("select * from salestask$test.tv_mycustomer limit 10;");
    /**
    ret.forEach(function (item) {
        html += ejs.render('<div>dddd data <%= a %></div> <%- content %> <%= name %>', { a: 2, content: '<h1>Hello</h1>', name: item.mobile });
    });
    **/
    let md = new markdown_it_1.default();
    var mdresult = md.render(content);
    let result = ejs.render(templet, { title: '模板页面', content: mdresult });
    resp.end(result);
};
//# sourceMappingURL=hello.js.map