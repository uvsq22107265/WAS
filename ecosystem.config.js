const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  apps : [{
    name   : "domino-game",
    script : "./._build/Server.js",
    watch: true,
  }],
}

