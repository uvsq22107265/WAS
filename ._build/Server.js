"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const App_1 = require("./App");
dotenv.config();
const port = parseInt(process.env.PORT, 10);
App_1.default.debug = !!+process.env.DEBUG;
App_1.default.server.listen(port, '0.0.0.0', () => {
    console.info(`Le jeu est maintenant accessible sur http://localhost:${port}...`);
});
