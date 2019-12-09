"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
exports.conn = Object.assign({}, config_1.default.get("mssqlJkConn"));
//# sourceMappingURL=connection.js.map