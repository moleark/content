import cors from 'cors';
import config from 'config';
import { pages } from "./pages";
import * as bodyParser from 'body-parser';
import express, { Request, Response, NextFunction, Router, Application } from 'express';

const markdownIt = require('markdown-it'), md = new markdownIt();

(async function () {

    // 创建express服务
    let app = express();
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    // 使用 body-parser 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.set('json replacer', (key: string, value: any) => {
        if (value === null) return undefined;
        return value;
    });

    //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
    app.use(express.static(__dirname + "/public"));
    // 或者以下这个也可以
    // app.use(express.static(path.join(__dirname, 'public'), {maxAge: 36000}));
    //设置模板视图的目录
    app.set("views", "./public/views");
    //设置是否启用视图编译缓存，启用将加快服务器执行效率
    app.set("view cache", true);
    // 2.注册html模板引擎：
    //app.engine('html', ejs.);
    //设置模板引擎的格式即运用何种模板引擎
    app.set("view engine", "html");
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    app.get('/', (req, res) => res.send('Hello World!'))
    app.use((req: Request, res: Response, next: NextFunction) => {
        next();
    });

    buildRouter(app, pages);

    // 监听服务
    let port = config.get<number>('port');

    app.listen(port, '0.0.0.0', async () => {
        console.log('J&K website on port ' + port);
    });
})();

function buildRouter(app: Application, pageDefines: any) {
    for (let i in pageDefines) {
        let page = pageDefines[i];
        switch (typeof (page)) {
            case 'object':
                buildRouter(app, page);
                break;
            case 'function':
                app.use('/' + i, page);
                break;
            case 'function':
                app.use('/web-build/' + i, page);
                break;
            default:
                throw 'unknown'
        }
    }
}


