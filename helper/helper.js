const Web3 = require("web3") // import web3 v1.0 constructor
const contract = require('truffle-contract');

// use globally injected web3 to find the currentProvider and wrap with web3 v1.0
const getWeb3 = (url) => {
  return new Web3(new Web3.providers.HttpProvider(url));
}

const artifactsToContract = async (web3, artifacts) => {
  if (!web3) {
    const delay = new Promise(resolve => setTimeout(resolve, 100));
    await delay;
    return await this.artifactsToContract(artifacts);
  }
  // web3.eth.transactionConfirmationBlocks = 4; // 4je bloki morajo miniti!
  const contractAbstraction = contract(artifacts);
  contractAbstraction.setProvider(web3.currentProvider);
  if (typeof contractAbstraction.currentProvider.sendAsync !== "function") {
    contractAbstraction.currentProvider.sendAsync = function () {
      return contractAbstraction.currentProvider.send.apply(
        contractAbstraction.currentProvider, arguments
      );
    };
  }
  return contractAbstraction;
}

const instanceToContract = async (instance) => {
  const web3 = getWeb3();
  // web3.eth.transactionConfirmationBlocks = 4; // 4je bloki morajo miniti!
  const contract = new web3.eth.Contract(instance.abi, instance.address);
  return contract;
}

module.exports = { artifactsToContract, instanceToContract, getWeb3 }