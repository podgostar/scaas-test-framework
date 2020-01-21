const user1_config = {
    address: 'ADDRESS',
    host: 'URL'
};

const user2_config = {
    address: 'ADDRESS',
    host: 'URL'
};

const client = new celer.Client('HOST URL');

/*
    CELER RESOURCES: 
    https://github.com/celer-network/Celer-Web-SDK/blob/master/demo/two-accounts/demo.js
    https://github.com/celer-network/celer-client
    https://medium.com/celer-network/everything-you-need-to-know-about-celer-network-updating-regularly-7f0c73e00205
*/


const main = async () => {

    const client_user1 = new celer.Client(user1_config);
    const client_user2 = new celer.Client(user2_config);

    /* USER 1 OPEN CHANNEL */
    // const cid = await client_user1.openEthChannel('20000', '20000');
    // console.log('Channel opened with CID: ', cid)

    /* USER 2 OPEN CHANNEL */
    // const cid = await client_user2.openEthChannel('20000','20000');
    // console.log('Channel opened with CID: ', cid)

    /* USER 1 DEPOSIT ETH IN CHANNEL */
    // const depositEthResult = await client_user1.depositEth('10000');
    // console.log('Deposit ETH result: ', depositEthResult)

    /* USER 2 DEPOSIT ETH IN CHANNEL */
    // const depositEthResult = await client_user2.depositEth(100);
    // console.log('Deposit ETH result: ', depositEthResult)

    /* GET USER 1 BALANCE*/
    // const balance_user1 = await client_user1.getEthBalance();
    // console.log('balance before', balance_user1.freeBalance);

    /* GET USER 2 BALANCE*/
    // const balance_user2 = await client_user2.getEthBalance();
    // console.log('balance before', balance_user2);


    /* USER 1 ACTIONS (check balance and send ETH)*/
    // const balance_user1_before = await client_user1.getEthBalance();
    // console.log('balance before', balance_user1_before);
    // try {
    //     const sendEthResult = await client_user1.sendEth('1', '915698420A180b54AF98DaF1c4A53e4d5C227461');
    //     console.log('send eth result: ', sendEthResult);

    // } catch (error) {
    //     console.log(error)
    // }

    // await timeout(1000); // Celer SDK does not indicate when the "micro-transaction" is finished.

    // for (; ;) {
    //     const test_balance = await client_user1.getEthBalance();
    //     console.log(test_balance)
    //     if (test_balance.freeBalance == balance_user1_before.freeBalance - 1) break;
    // }

    // const balance_user1_after = await client_user1.getEthBalance();
    // console.log('balance after', balance_user1_after);

    /* USER 2 ACTIONS (check balance and send ETH)*/

    // const balance_user2_before = await client_user2.getEthBalance();
    // console.log('balance before', balance_user2_before);

    // const sendEthResult = await client_user2.sendEth('1', 'B4Be30365cC35C5C4AfaaE0B3c04A21D454DB236');
    // console.log('send eth result: ', sendEthResult);

    // for (; ;) {
    //     const test_balance = await client_user2.getEthBalance();
    //     if (test_balance.freeBalance == balance_user2_before.freeBalance - 1) {
    //         break;
    //     };
    // }

    // await timeout(1000);

    // const balance_user2_after = await client_user2.getEthBalance();
    // console.log('balance after', balance_user2_after);

    // const balance_user1 = await client_user1.getEthBalance();
    // console.log('balance after u1', balance_user1.freeBalance);

    // const close_mc = await client_user1.withdrawEth('1');
    // console.log(close channel)


    /* CELER BENCHMARK - user 1 sends microtranstions to user 2 */
    console.log('START')
    let number_of_transactions_total = 0;
    let lastTime = 0;
    for (const time of intermediateTimes) {
        const runTime = time - lastTime;
        lastTime = time;
        const number_of_performed_transactions = await test_case(client_user1, runTime);
        number_of_transactions_total += number_of_performed_transactions;
        console.log(number_of_transactions_total)
    }

    process.exit();
}

const test_case = (client_user1, test_time) => new Promise(async (resolve, reject) => {

    let balance_entry = await client_user1.getEthBalance();
    console.log('balance entry: ', balance_entry)
    let balance_exit = 0;

    try {
        let number_of_transactions = 0;
        marky.mark("offchain");
        loop2:
        while (true) {
            if (marky.stop("offchain").duration < test_time) {
                const balance_user1_before = await client_user1.getEthBalance();
                try {
                    await client_user1.sendEth('1', 'fc0ce9864356a724a8512f9f62c4464d351edd32');
                } catch (error) {
                    console.log('error sendETH')
                }
                loop1:
                for (; ;) {
                    const test_balance = await client_user1.getEthBalance();
                    if (test_balance.freeBalance == balance_user1_before.freeBalance) {
                        break loop1;
                    };
                }
            } else
                break loop2;
        }

        balance_exit = await client_user1.getEthBalance();
        console.log('balance exit: ', balance_exit)
        number_of_transactions = parseInt(balance_exit.freeBalance) - parseInt(balance_entry.freeBalance);
        resolve(number_of_transactions);
    } catch (error) {
        reject(error);
    }
})

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()
