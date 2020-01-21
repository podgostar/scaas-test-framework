const axios = require('axios');
const marky = require('marky');

const { intermediateTimes } = config.stateChannelData;

// const paymentEndpoint = "ENTER RAIDEN CHANNEL API ENDPOINT";

let body_payment = {
    amount: 1
}

const test_case = (test_time) => new Promise(async (resolve, reject) => {

    try {
        let number_of_transactions = 0;
        marky.mark("offchain");
        while (true) {
            if (marky.stop("offchain").duration < test_time) {
                await axios.post(paymentEndpoint, body_payment);
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

    console.log('Channel opened')

    let number_of_transactions_total = 0;

    let lastTime = 0;

    for (const time of intermediateTimes) {
        const runTime = time - lastTime;
        lastTime = time;
        const number_of_performed_transactions = await test_case(runTime);
        number_of_transactions_total += number_of_performed_transactions;
        console.log(number_of_transactions_total)
    }

}

main();
