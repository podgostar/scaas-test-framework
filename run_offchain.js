const testHelper = require('./helper/testHelper.js');
const marky = require('marky');

const config = require('./config.js');

const { channelId, userA_address, userA_privateKey, userB_address, userB_privateKey, stake_on_open, intermediateTimes, microtransaction_amount } = config.stateChannelData;

const test_case = (userA_address, channelId, microtransaction_amount, userA_privateKey, test_time) => new Promise(async (resolve, reject) => {

    try {
        let number_of_transactions = 0;
        marky.mark("offchain");
        while (true) {
            if (marky.stop("offchain").duration < test_time) {
                await testHelper.sendPayment({ userAddress: userA_address, channelId: channelId, microtransaction_amount: microtransaction_amount, privateKey: userA_privateKey });
                number_of_transactions += 1;
            } else
                break;
        }
        resolve(number_of_transactions);
    } catch (error) {
        reject(error);
    }
})

const main = async () => {

    console.log('Channel ID:', channelId)
    await testHelper.open({ userA_address: userA_address, userB_address: userB_address, stake_on_open: stake_on_open, userA_privateKey: userA_privateKey, channelId: channelId });

    console.log('Channel initialized')

    await testHelper.join({ userB_address: userB_address, channelId: channelId, userB_privateKey: userB_privateKey })

    console.log('Channel opened')

    let number_of_transactions_total = 0;

    let lastTime = 0;

    for (const time of intermediateTimes) {
        const runTime = time - lastTime;
        lastTime = time;
        const number_of_performed_transactions = await test_case(userA_address, channelId, microtransaction_amount, userA_privateKey, runTime);
        number_of_transactions_total += number_of_performed_transactions;
        console.log(number_of_transactions_total)
    }

    await testHelper.close({ channelId: channelId, privateKey: userB_privateKey })
    console.log("Channel closed")

}

main();


