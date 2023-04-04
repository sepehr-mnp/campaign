// solc compiler
solc = require("solc");

// file reader
fs = require("fs");

// Creation of Web3 class
Web3 = require("web3");

///const ganache = require("ganache-cli");
// Setting up a HttpProvider
//web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

//web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mainnet.maticvigil.com/v1/fbfd2a06db235d6862a67db6411d9f34c39cff54"));
//web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/eth_goerli"));
web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.blockpi.network/v1/rpc/public"));
  
// Reading the file
file = fs.readFileSync("contract/Lottery.sol").toString();

// console.log(file);

// input structure for solidity compiler
var input = {
	language: "Solidity",
	sources: {
		"Lottery.sol": {
			content: file,
		},
	},

	settings: {
		outputSelection: {
			"*": {
				"*": ["*"],
			},
		},
	},
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Result : ", output);

ABI = output.contracts["Lottery.sol"]["Lottery"].abi;
bytecode = output.contracts["Lottery.sol"]["Lottery"].evm.bytecode.object;
// console.log("Bytecode: ", bytecode);
// console.log("ABI: ", ABI);


//web3.eth.setProvider(Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/v1/fbfd2a06db235d6862a67db6411d9f34c39cff54"));
/*
web3.setProvider(web3.currentProvider);
contract = new web3.eth.Contract(ABI);
const deploy = async () => {
	//const accounts = await web3.eth.getAccounts();
	let wallet = web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount('0xc6ec3cd7f55c2cb9ce0f8bc692b823ead343c89b15b0e161ac4b794bd69ee9d7'));
    console.log(wallet);
	console.log("abi:",ABI);
	console.log('Attempting to deploy from account', wallet["address"]);
	contract
	.deploy({ data: bytecode  })
	//.send({from: wallet["address"], gas: 5000000, gasPrice:30000000000})
	.send({from: wallet["address"], gas: 1000000})
	.on("receipt", (receipt) => {

		// Contract Address will be returned here
		console.log("Contract Address:", receipt.contractAddress);
	});
  };deploy();
*/