"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgradeDb_1 = require("../mysql/upgradeDb");
upgradeDb_1.upgrade().then(v => {
    console.log('Database upgrade finished.');
    process.exit();
});
//# sourceMappingURL=upgrade.js.map