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
        console.log(ret, 'ret');
        if (ret.length > 0) {
            let md = new markdown_it_1.default({ html: true });
            let { content, caption, template, image } = ret[0];
            if (template == null)
                resp.redirect("/err");
            // await tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPOST\t${req.ip}\t\n')`);
            let data = {
                icon_image: image,
                title: caption,
                content: mdResult(md, content),
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
//# sourceMappingURL=templet.js.map