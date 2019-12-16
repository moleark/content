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
exports.post = async (req, resp) => {
    if (req.query.param) {
        let queryparam = req.query.param;
        const ret = await tool_1.tableFromSql(`SELECT * FROM webbuilder$test.tv_post WHERE id=${queryparam}`);
        if (ret.length > 0) {
            let md = new markdown_it_1.default();
            let { content, template } = ret[0];
            let data = {
                title: '模板页面',
                content: content,
            };
            let result = ejs.render('<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" ><body><%= content %></body></html>', data);
            resp.end(result);
        }
        else {
            resp.redirect("/b");
        }
    }
    else {
        resp.redirect("/b");
    }
};
//# sourceMappingURL=post.js.map