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
// call webbuilder$test.tv_addbrowsinghistory (24,47,'1\tPOST\t211.5.4.7\t\n');
const sqlForWebBrand = `
    SELECT  a.webpage, a.branch, b.content as branch, a.sort
    FROM    webbuilder$test.tv_webpagebranch a 
            left join webbuilder$test.tv_branch b on a.branch=b.id 
    WHERE a.webpage=
`;
const sqlForWeb = `
    SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
const sqlForMobile = `
SELECT  a.titel, a.name, b.contentModule as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
exports.webpage = async (req, resp) => {
    await doPost(req, resp);
};
async function doPost(req, resp) {
    let userAgent = req.headers['user-agent'].toLowerCase();
    let isMobile = userAgent.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    if (id) {
        console.log(req.ip);
        let sql = isMobile ? sqlForMobile : sqlForWeb;
        const ret = await tool_1.tableFromSql(sql + id);
        const webpageData = await tool_1.tableFromSql(sqlForWebBrand + id + " order by a.sort ");
        let content = '';
        let md = new markdown_it_1.default({ html: true });
        if (webpageData.length >= 1) {
            webpageData.sort(function (m, n) {
                if (m.sort < n.sort)
                    return -1;
                else if (m.sort > n.sort)
                    return 1;
                else
                    return 0;
            });
            content = webpageData.map(element => {
                return mdResult(md, element.branch);
            }).join('');
        }
        else {
            content = mdResult(md, '内');
        }
        if (ret.length > 0) {
            await tool_1.tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPAGE\t${req.ip}\t\n')`);
            let { titel, template } = ret[0];
            if (template == null)
                resp.redirect("/err");
            let data = {
                title: titel,
                content: content,
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
//# sourceMappingURL=webPage.js.map