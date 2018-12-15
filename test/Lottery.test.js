const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require    ("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("Contract is successfully deployed", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.2", "ether")
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(1, players.length);
    assert.equal(accounts[0], players[0]);
  });

  it("allows multiple account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.2", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.2", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.2", "ether")
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(3, players.length);
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
  });

  it("requires minimum amount of ether to enter", async () => {
    try {
      await lottery.motehods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (err) {
      //console.log("Entered into catch");
      assert(err);
    }
  });

  it("only manager can call pickwinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
      //  console.log("deployer is not picking winner");
      //console.log(msg.sender);
      //  console.log(players.length);
    }
  });

  it("sends money to the winner and resets the player array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether")
    });

    const initialbalance = await web3.eth.getBalance(accounts[0]);
    console.log(initialbalance);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const finalbalance = await web3.eth.getBalance(accounts[0]);
    console.log(finalbalance);
    const difference = finalbalance - initialbalance;
    console.log(difference);
    assert(difference > web3.utils.toWei("1.8", "ether"));
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert.equal(0, players.length);
    console.log(players.length);
  });
});
