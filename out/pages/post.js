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
var logger = require('./../../logs/logger.js');
const sqlForWeb = `
SELECT a.content, a.caption, b.content as template, c.path as image
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
        left join webbuilder$test.tv_image c on a.image=c.id
    WHERE a.id=
`;
const sqlForMobile = `
SELECT a.content, a.caption, b.contentModule as template
    FROM webbuilder$test.tv_post a 
        left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
exports.post = async (req, resp) => {
    await doPost(req, resp);
};
async function doPost(req, resp) {
    logger.info(req.headers);
    let userAgent = req.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        let sql = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tool_1.tableFromSql(sql + id);
        if (ret.length > 0) {
            let md = new markdown_it_1.default({ html: true });
            let { content, template } = ret[0];
            if (template == null)
                resp.redirect("/err");
            await tool_1.tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPOST\t${req.ip}\t\n')`);
            let data = {
                replace: mdResult(md, content),
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
//# sourceMappingURL=post.js.map