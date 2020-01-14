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
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const pages_1 = require("./pages");
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const markdownIt = require('markdown-it'), md = new markdownIt();
(async function () {
    // 创建express服务
    let app = express_1.default();
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    // 使用 body-parser 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors_1.default());
    app.set('json replacer', (key, value) => {
        if (value === null)
            return undefined;
        return value;
    });
    //挂载静态资源处理中间件,设置css或者js引用文件的静态路径
    app.use(express_1.default.static(__dirname + "/public"));
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
    app.get('/', (req, res) => res.send('Hello World!'));
    app.use((req, res, next) => {
        next();
    });
    buildRouter(app, pages_1.pages);
    // 监听服务
    let port = config_1.default.get('port');
    app.listen(port, '0.0.0.0', async () => {
        console.log('J&K website on port ' + port);
    });
})();
function buildRouter(app, pageDefines) {
    for (let i in pageDefines) {
        let page = pageDefines[i];
        switch (typeof (page)) {
            case 'object':
                buildRouter(app, page);
                break;
            case 'function':
                app.get('/' + i, page);
                break;
            case 'function':
                app.get('/web-build/' + i, page);
                break;
            default:
                throw 'unknown';
        }
    }
}
//# sourceMappingURL=index.js.map