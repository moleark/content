"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello_1 = require("./hello");
const errorPage_1 = require("./errorPage");
const markdown_1 = require("./markdown");
const post_1 = require("./post");
exports.pages = {
    "hello": {
        "a": hello_1.hello,
        "err": errorPage_1.errorPage,
    },
    "markdown": markdown_1.markdown,
    "post-m/:id": post_1.postM,
    "post-w/:id": post_1.postW,
    "post/:id": post_1.post,
};
//# sourceMappingURL=index.js.map