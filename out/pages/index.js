"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello_1 = require("./hello");
const composing_1 = require("./composing");
const markdown_1 = require("./markdown");
const post_1 = require("./post");
exports.pages = {
    "hello": {
        "a": hello_1.hello,
        "b": composing_1.composing,
    },
    "markdown": markdown_1.markdown,
    "post": post_1.post,
};
//# sourceMappingURL=index.js.map