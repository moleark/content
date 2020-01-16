"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello_1 = require("./hello");
const errorPage_1 = require("./errorPage");
const markdown_1 = require("./markdown");
const post_1 = require("./post");
const webPage_1 = require("./webPage");
const template_1 = require("./template");
exports.pages = {
    "hello": {
        "a": hello_1.hello,
        "err": errorPage_1.errorPage,
    },
    "markdown": markdown_1.markdown,
    "post/:id": post_1.post,
    "webpage/:id": webPage_1.webpage,
    "template/:id": template_1.template,
};
//# sourceMappingURL=index.js.map