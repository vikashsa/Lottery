const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile.js");

const provider = new HDWalletProvider(
  "rich place hair carbon hazard butter frame coach auto other badge uncle",
  "https://rinkeby.infura.io/YImj0VDAAmOCsnsmciH8"
);
const web3 = new Web3(provider);

//console.log(web3);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: "0x" + bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("contracts deployed to ", result.options.address);
  console.log(interface);
};

deploy();
