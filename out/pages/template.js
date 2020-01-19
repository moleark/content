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
const templet = `<!DOCTYPE html><html lang = "en"> <head> <meta charset = "UTF-8" > </head><body> <div> <h1 style="color:red; text-align: center;">[ 没有模板 ]请添加</h1> </div> </body></html>`;
const sqlForWeb = `
SELECT b.content 
    FROM webbuilder$test.tv_template b 
    WHERE b.id=
`;
// const sqlForWeb = `SELECT * FROM webbuilder$test.tv_template WHERE id=`
const sqlForMobile = `
SELECT b.contentModule
    FROM webbuilder$test.tv_template b 
    WHERE b.id=
`;
exports.template = async (req, resp) => {
    await doTemplate(req, resp);
};
async function doTemplate(req, resp) {
    let userAgent = req.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        let sql = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tool_1.tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new markdown_it_1.default({ html: true });
            let template;
            if (isMobile) {
                if (ret[0].contentModule === null) {
                    template = templet;
                }
                else {
                    template = ret[0].contentModule;
                }
            }
            else {
                if (ret[0].content === null) {
                    template = templet;
                }
                else {
                    template = ret[0].content;
                }
            }
            let data = {
                replace: mdResult(md, ''),
                title: ''
            };
            let result = ejs.render(template, data);
            resp.end(result);
        }
        else {
            resp.redirect("/err");
        }
    }
    else {
        resp.redirect("/err");
    }
}
function mdResult(md, content) {
    return md.render(content);
}
//# sourceMappingURL=template.js.map