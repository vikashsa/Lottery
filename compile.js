const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve("contracts", "Lottery.sol");
//console.log(inboxPath);

const source = fs.readFileSync(lotteryPath, "utf8");
//console.log(solc.compile(source, 1));
//console.log(solc.compile(source,1).contracts[':Inbox'].bytecode);
module.exports = solc.compile(source, 1).contracts[":Lottery"];
