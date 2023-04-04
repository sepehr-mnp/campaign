//run with >node compile.js
 path = require('path');
  fs = require('fs-extra');
  solc= require('solc');

 const buildPath = path.resolve(__dirname, 'build');

 fs.removeSync(buildPath);

 //const campaignPath= path.resolve(__dirname,'contract',   'Campain.sol');
 file = fs.readFileSync("contract/Campain.sol").toString();

// console.log(file);

// input structure for solidity compiler
var input = {
	language: "Solidity",
	sources: {
		"Campain.sol": {
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

var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campain.sol'];
console.log("Result : ", output);
 fs.ensureDirSync(buildPath);

 for(let contract in output){
  fs.outputJSONSync(
    path.resolve(buildPath,contract+'.json'),
    output[contract]
  );
 }
 
 /*var input = {
    language: 'Solidity',
    sources: {
             'Campain.sol': {
              content: source
   }
},
    settings: {
              outputSelection: {
              '*': {
                 '*': ['*'] 
                  }
               }
      }
};
module.exports = JSON.parse(solc.compile(JSON.stringify(input)))['contract']['Campain .sol']['Lottery'];
console.log(module.exports);///mudole.exports chizi ast ke barnamat khorji midahad baraye hamin mitoni ba oonyeki barname ino begiry
*/