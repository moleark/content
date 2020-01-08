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
const sqlForWeb = `
    SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
const sqlForWebBrand = `
    SELECT  a.webpage, a.branch, b.content as branch, a.sort
    FROM    webbuilder$test.tv_webpagebranch a 
            left join webbuilder$test.tv_branch b on a.branch=b.id 
    WHERE a.webpage=
`;
const sqlForMobile = `
SELECT  a.titel, a.name, b.content as template
    FROM    webbuilder$test.tv_webpage a 
            left join webbuilder$test.tv_template b on a.template=b.id 
    WHERE a.id=
`;
exports.webpage = async (req, resp) => {
    await doPost(req, resp, 'auto');
};
const getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};
async function doPost(req, resp, type) {
    var _a;
    let userAgent = req.headers['user-agent'];
    let isMobile = (_a = userAgent) === null || _a === void 0 ? void 0 : _a.match(/iphone|ipod|ipad|android/);
    let id = req.params['id'];
    let userIp = getIp(req);
    if (id) {
        let sql;
        switch (type) {
            case 'auto':
                sql = isMobile ? sqlForMobile : sqlForWeb;
                break;
        }
        const ret = await tool_1.tableFromSql(sql + id);
        const webpageData = await tool_1.tableFromSql(sqlForWebBrand + id + " order by a.sort ");
        let content = '';
        let md = new markdown_it_1.default({ html: true });
        webpageData.sort(function (m, n) {
            if (m.sort < n.sort)
                return -1;
            else if (m.sort > n.sort)
                return 1;
            else
                return 0;
        });
        if (webpageData.length >= 1) {
            content = webpageData.map(element => {
                return mdResult(md, element.branch);
            }).join('');
        }
        else {
            content = webpageData[0].branch;
        }
        if (ret.length > 0) {
            await tool_1.tableFromSql(`call webbuilder$test.tv_addbrowsinghistory (24,47,'${id}\tPAGE\t${userIp}\t\n')`);
            let { titel, template, name } = ret[0];
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