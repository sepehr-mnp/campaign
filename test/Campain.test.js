//use with >  npm run test


const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const compiledFactory = require("../ethereum/build/CampainFactory.json");
const compiledCampin = require("../ethereum/build/Campain.json");
const { describe } = require("mocha");

let accounts;
let factory;
let campainAddress;
let campaign;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract((compiledFactory.abi))
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "5000000" });
  
    await factory.methods.createCampain('100').send({ from: accounts[0], gas: "5000000" });

    [campainAddress] = await factory.methods.getDeployedCampains().call(); // gets an array and put the first element of it in campainAddress
    campaign = await new web3.eth.Contract(compiledCampin.abi,campainAddress);

});

describe('Campains',()=>{
    it('deploys a factory and campain contract',()=>{
        assert.ok(factory.options.address);//test if it has a valid address
       assert.ok(campaign.options.address);
    });
    it("marks caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
      });
    
      it("allows people to contribute money and marks them as approvers", async () => {
        await campaign.methods.contribute().send({
          value: "200",
          from: accounts[1],
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
      });
    
      it("requires a minimum contribution", async () => {
        try {
          await campaign.methods.contribute().send({
            value: "5",
            from: accounts[1],
          });
          assert(false);
        } catch (err) {
          assert(err);
        }
      });
    
      it("allows a manager to make a payment request", async () => {
        await campaign.methods
          .createRequest("Buy batteries", "100", accounts[1])
          .send({
            from: accounts[0],
            gas: "6800000",
          });
        const request = await campaign.methods.requests(0).call();
    
        assert.equal("Buy batteries", request.description);
      });
    
      it("processes requests", async () => {
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei("10", "ether"),
        });
    
        await campaign.methods
          .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
          .send({ from: accounts[0], gas: "1000000" });
    
        await campaign.methods.approveRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        await campaign.methods.finalizeRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
      });
    });