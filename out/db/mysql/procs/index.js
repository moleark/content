"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sys_1 = __importDefault(require("./sys"));
const queue_1 = __importDefault(require("./queue"));
exports.procDefs = [
    ...sys_1.default,
    ...queue_1.default
];
//# sourceMappingURL=index.js.map