const Web3 = require("web3"); // import web3 v1.0 constructor
const HDWalletProvider = require("truffle-hdwallet-provider");
const marky = require('marky');

const config = require('./config');

const rpcUrl = config.ethereumNetwork.rpcUrl;

const gasPrice = 50000000000;

const number_of_transactions_to_be_tested = config.blockchainData.number_of_transactions_to_be_tested;

const main = async () => {

    const userA_address = config.blockchainData.userA_address;
    const userA_privateKey = config.blockchainData.userA_privateKey;
    const userB_address = config.blockchainData.userB_address;
    const transaction_amount = config.blockchainData.transaction_amount;

    const provider = new HDWalletProvider(userA_privateKey, rpcUrl);

    const web3 = new Web3(provider);

    marky.mark("onchain");

    for (let j = 0; j < number_of_transactions_to_be_tested;) {
        await web3.eth.sendTransaction({ from: userA_address, to: userB_address, value: transaction_amount, gasPrice: gasPrice })
        j++;
        console.log(marky.stop('onchain').duration)
    }

    console.log("finished")
}


main();






