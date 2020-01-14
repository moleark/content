import { hello } from "./hello";
import { errorPage } from "./errorPage";
import { markdown } from "./markdown";
import { post } from './post';
import { webpage } from './webPage'

export const pages = {
    "hello": {
        "a": hello,
        "err": errorPage,
    },
    "markdown": markdown,
    "post/:id": post,
    "webpage/:id": webpage,
}