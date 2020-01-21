const axios = require('axios');
const config = require('../config');

const { protocol, host, port } = config.testFrameworkEndpoints;

const test_open_endpoint = `${protocol}://${host}:${port}/open`
const test_join_endpoint = `${protocol}://${host}:${port}/join`
const test_sendpayment_endpoint = `${protocol}://${host}:${port}/sendPayment`
const test_close_endpoint = `${protocol}://${host}:${port}/close`

axios.defaults.timeout = 20000000;

const open = (item) => new Promise(async (resolve, reject) => {

    let body_open = {
        userA_address: item.userA_address,
        userB_address: item.userB_address,
        stake_on_open: item.stake_on_open,
        userA_privateKey: item.userA_privateKey,
        channelId: item.channelId
    }

    try {
        const result = await axios.post(test_open_endpoint, body_open);
        resolve(result.data.channelAddress)
    } catch (error) {
        reject(new Error(`open: ${error}`));
    }
})

const join = (item) => new Promise(async (resolve, reject) => {

    let body_join = {
        userB_address: item.userB_address,
        channelId: item.channelId,
        userB_privateKey: item.userB_privateKey
    }

    try {

        await axios.post(test_join_endpoint, body_join);
        resolve(true);
    } catch (error) {
        reject(new Error(`join: ${error}`));
    }
})

const sendPayment = (item) => new Promise(async (resolve, reject) => {

    let body_sendPayment = {
        userAddress: item.userAddress,
        channelId: item.channelId,
        microtransaction_amount: item.microtransaction_amount,
        privateKey: item.privateKey
    }

    try {
        await axios.post(test_sendpayment_endpoint, body_sendPayment);
        resolve(true);
    } catch (error) {
        reject(new Error(`sendPayment: ${error}`));
    }
})

const close = (item) => new Promise(async (resolve, reject) => {

    let body_close = {
        channelId: item.channelId,
        privateKey: item.privateKey
    }

    try {
        await axios.post(test_close_endpoint, body_close);
        resolve(true);
    } catch (error) {
        reject(new Error(`close: ${error}`));
    }
})


module.exports = {
    open,
    join,
    sendPayment,
    close
}
