// TypeScript issue
// https://github.com/Microsoft/TypeScript/issues/6615

// import * as config from "../config.json";

var configFile = require("../config.json");
process.env["APP_PROFILE"] = "test";
export let config: any;
if (process.env["APP_PROFILE"] == "test") {
  config = configFile.test;
} else if (process.env["APP_PROFILE"] == "prod") {
  config = configFile.prod;
} else {
  config = configFile.dev;
}

export default config;
