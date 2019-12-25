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
const fs_1 = __importDefault(require("fs"));
const ejs = __importStar(require("ejs"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const errContent = `# Sorry..页面没有找到！`;
const errImg = `![Mou icon](https://cdn2.jianshu.io/shakespeare/_next/static/images/404-203cdc8362d3b571276978d13f5ffd21.png)`;
exports.errorPage = async (req, resp) => {
    fs_1.default.readFile('ts/pages/templets/err.html', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        else {
            let md = new markdown_it_1.default();
            let replaceData = {
                title: '项目ONE',
                content: md.render(errContent),
                img: md.render(errImg)
            };
            let result = ejs.render(data, replaceData);
            resp.end(result);
        }
    });
};
//# sourceMappingURL=errorPage.js.map