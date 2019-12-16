import { hello } from "./hello";
import { composing } from "./composing";
import { markdown } from "./markdown";
import { post } from './post';

export const pages = {
    "hello": {
        "a": hello,
        "b": composing,
    },
    "markdown": markdown,
    "post": post,
}