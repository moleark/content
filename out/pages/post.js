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
const tool_1 = require("../db/mysql/tool");
exports.post = async (req, resp) => {
    let templet = null;
    console.log(req, 'url');
    fs_1.default.readFile('ts/pages/templets/post.html', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        else {
            templet = data;
        }
    });
    let id = req.params['id'];
    if (id) {
        const ret = await tool_1.tableFromSql(`SELECT a.content, a.caption, b.content as template FROM webbuilder$test.tv_post a left join webbuilder$test.tv_template b on a.template=b.id WHERE a.id=${id}`);
        if (ret.length > 0) {
            let { content, caption, template } = ret[0];
            console.log(ret[0]);
            let data = {
                title: caption,
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
};
//# sourceMappingURL=post.js.map