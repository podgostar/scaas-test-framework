var express = require('express');
var router = express.Router();
const chalk = require('chalk');

const axios = require('axios');

const config = require('../config');
const helper = require('../helper/helper.js');

var HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const sigUtil = require('eth-sig-util');

const { rpcUrl, gasPrice } = config.ethereumNetwork;

const scaasscBuild = require('../build/contracts/ScaaSSC.json');

const { protocol, host, port } = config.stateServiceEndpoints;

const payment_channel_api_url_channel_preopen = `${protocol}://${host}:${port}/channel/preopen`;
const payment_channel_api_url_signature_check_and_create_channel = `${protocol}://${host}:${port}/channel/checkAndCreateChannel`
const payment_channel_api_url_channel_init = `${protocol}://${host}:${port}/channel/init`
const payment_channel_api_url_channel_checkandsendpayment = `${protocol}://${host}:${port}/channel/checkAndSendPayment`
const payment_channel_api_url_channel_presendpayment = `${protocol}://${host}:${port}/channel/preSendPayment`
const payment_channel_api_url_channel_close = `${protocol}://${host}:${port}/channel/close`

router.post('/open', async (req, res) => {

  console.log(chalk.blue('ENTERING: ') + '/open test func');
  console.log(chalk.cyan(JSON.stringify(req.body)));

  let userA_address = req.body.userA_address;
  let userB_address = req.body.userB_address;
  let stake_on_open = req.body.stake_on_open;
  let userA_privateKey = req.body.userA_privateKey;
  let channelId = req.body.channelId;

  try {

    const paymentJSON = await axios.post(payment_channel_api_url_channel_init, { sender: userA_address, addressTwo: userB_address, stake: stake_on_open });

    const paymentJSON_user_sig = await sigUtil.personalSign(Buffer.from(userA_privateKey, 'hex'), { data: JSON.stringify(paymentJSON.data).toLowerCase() })

    const resultPreopen = await axios.post(payment_channel_api_url_channel_preopen, { json: paymentJSON.data, signature: paymentJSON_user_sig })

    const provider = new HDWalletProvider(userA_privateKey, rpcUrl);

    const scaasscFactory = await helper.artifactsToContract(new Web3(provider), scaasscBuild);

    const scaasscInstance = await scaasscFactory.deployed();

    await scaasscInstance.newChannel(
      channelId,
      resultPreopen.data.oracleAddress.toLowerCase(),
      resultPreopen.data.ipnsId, userB_address.toLowerCase(),
      {
        from: userA_address,
        value: stake_on_open,
        gasPrice: gasPrice
      }
    )

    console.log(chalk.green('SUCCESS: ') + `state channel ID: ${channelId}`);

    await axios.post(payment_channel_api_url_signature_check_and_create_channel, { channelId: channelId, ipfsHash: resultPreopen.data.ipfshHash })

    console.log(chalk.green('SUCCESS: ') + `state channel initialized`);

    return res.json({ channelId: channelId });

  } catch (error) {
    console.log(chalk.red('ERROR: ') + error);
    console.log(chalk.cyan(JSON.stringify(req.body)));
    return res.status(400).end();
  }
})

router.post('/join', async (req, res) => {

  console.log(chalk.blue('ENTERING: ') + '/join test func');
  console.log(chalk.cyan(JSON.stringify(req.body)));

  let userB_address = req.body.userB_address;
  let channelId = req.body.channelId;
  let userB_privateKey = req.body.userB_privateKey;

  try {

    const provider = new HDWalletProvider(userB_privateKey, rpcUrl);
    const scaasscFactory = await helper.artifactsToContract(new Web3(provider), scaasscBuild);
    const scaasscInstance = await scaasscFactory.deployed();
    const channelInfo = await scaasscInstance.getChannelInfo.call(channelId);
    const stake = ((channelInfo[5] / 90) * 100);
    const resultTx = await scaasscInstance.joinChannel(channelId, { from: userB_address, value: stake, gasPrice: gasPrice })

    console.log(chalk.green('SUCCESS: ') + `user joined, channel is opened`);

    return res.json(resultTx);
  } catch (error) {
    console.log(chalk.red('ERROR: ') + error);
    console.log(chalk.cyan(JSON.stringify(req.body)));
    return res.status(400).end();
  }

})

router.post('/sendPayment', async (req, res) => {

  console.log(chalk.blue('ENTERING: ') + '/sendPayment test func');
  console.log(chalk.cyan(JSON.stringify(req.body)));

  let userAddress = req.body.userAddress;
  let channelId = req.body.channelId;
  let microtransaction_amount = req.body.microtransaction_amount;
  let privateKey = req.body.privateKey;

  try {

    const initPaymentJSON = await axios.post(payment_channel_api_url_channel_presendpayment, { sender: userAddress, channelId: channelId, amount: microtransaction_amount });

    const initPayment_user_sig = await sigUtil.personalSign(Buffer.from(privateKey, 'hex'), { data: JSON.stringify(initPaymentJSON.data).toLowerCase() })

    const checkandsendResult = await axios.post(payment_channel_api_url_channel_checkandsendpayment, { sig: initPayment_user_sig, json: initPaymentJSON.data, channelId: channelId, amount: microtransaction_amount })

    console.log(chalk.green('SUCCESS: ') + `microtransaction sent`);

    return res.json(checkandsendResult.data);
  } catch (error) {
    console.log(chalk.red('ERROR: ') + error);
    console.log(chalk.cyan(JSON.stringify(req.body)));
    return res.status(400).end();
  }

})


router.post('/close', async (req, res) => {

  console.log(chalk.blue('ENTERING: ') + '/close test func');
  console.log(chalk.cyan(JSON.stringify(req.body)));

  let channelId = req.body.channelId;
  let privateKey = req.body.privateKey;

  try {

    const close_channel_user_sig = await sigUtil.personalSign(Buffer.from(privateKey, 'hex'), { data: "close payment channel" })

    const resultTx = await axios.post(payment_channel_api_url_channel_close, { channelId: channelId, sig: close_channel_user_sig })

    console.log(chalk.green('SUCCESS: ') + `channel closed`);

    return res.json(resultTx.data);
  } catch (error) {
    console.log(chalk.red('ERROR: ') + error);
    console.log(chalk.cyan(JSON.stringify(req.body)));
    return res.status(400).end();
  }

})

module.exports = router;
