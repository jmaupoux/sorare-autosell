import * as fs from "fs";

const config = JSON.parse(fs.readFileSync(process.argv[2], "utf-8")) as Config;

export {config};