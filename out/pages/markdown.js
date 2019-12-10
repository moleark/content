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
const fs_1 = __importDefault(require("fs"));
const markdown_it_1 = __importDefault(require("markdown-it"));
exports.markdown = async (req, resp) => {
    let html = '<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><title> <%- title %> </title> <style type = "text/css" >h1 {color: blue;}</style></head><body> <div></div> <%- content %> </body></html>';
    fs_1.default.readFile("../contentmanagement/ts/dome.md", 'utf8', (err, data) => {
        if (err)
            return;
        else {
            let md = new markdown_it_1.default();
            let mdresult = md.render(data);
            let result = ejs.render(html, { title: '模板页面', content: mdresult });
            resp.end(result);
        }
    });
};
//# sourceMappingURL=markdown.js.map