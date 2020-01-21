# Payment Service SYSTEM PERFORMANCE TEST FRAMEWORK

### Prerequisites

```
* NodeJS (8+)
* Running State channel API (URL)
* 2 Ethereum accounts with funds on ROPSTEN network

```

### Installing


Clone this repo:

```
<!-- git clone URL -->
```

Inside folder, run:

```
npm i
```

Set values in config.js

```

const ethereumNetwork = {
  rpcUrl: 'RPC URL',
  gasPrice: 10000000000
};

const testFrameworkEndpoints = {
  protocol: 'PROTOCOL',
  host: 'TEST FRAMEWORK URL',
  port: 'PORT'
}

const stateServiceEndpoints = {
  protocol: 'PROTOCOL',
  host: 'STATE SERVICE URL',
  port: 'PORT'
}

const stateChannelData = {
  channelId: UNIQUE CHANNEL ID (integer)
  userA_address: 'STATE CHANNEL USER A',
  userA_privateKey: 'USER A PRIVATE KEY',
  userB_address: 'STATE CHANNEL USER B',
  userB_privateKey: 'USER B PRIVATE KEY'
  stake_on_open: 'CHANNEL STAKE', // (e.g 6000000000000000) - must be greater or equal 6000000000000000
  intermediateTimes: [], // (e.g [60000,120000,180000]) - 1 min, 2 min, 3 min.. copy logs from 'run_onchain.js' script results
  microtransaction_amount: MICROTRANSACTIONS AMOUNT // (e.g 100000000) 
}

const blockchainData = {
  userA_address: "USER A ADDRESS",
  userA_privateKey: "USER A PRIVATE KEY",
  userB_address: "USER B ADDRESS",
  transaction_amount: 100000000,
  number_of_transactions_to_be_tested: 'NUMBER OF TRANSACTIONS'
}
```

You may run an app now:

```

npm start

```

To test ON-CHAIN transactions:

```

node run_onchain.js

```

To test OFF-CHAIN transactions:

```

node run_onchain.js

```

To test Raiden network:


### Prerequisites
* Running Raiden client  (https://github.com/raiden-network/raiden)
* Opened raiden payment channel
* Raiden API endpoint of opened payment channel
* Check run_raiden.js and insert aforementioned data in .js script
```

node run_raiden.js

```

To test Celer network:


### Prerequisites
* Two Running Celer clients  (https://github.com/celer-network/celer-client)
* Check run_celer.js and insert data (address, host) about clients in .js script
```

node run_raiden.js

```
