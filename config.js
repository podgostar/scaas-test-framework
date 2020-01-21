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
  channelId: 'UNIQUE CHANNEL ID (integer)',
  userA_address: "STATE CHANNEL USER A",
  userA_privateKey: "USER A PRIVATE KEY",
  userB_address: "STATE CHANNEL USER B",
  userB_privateKey: "USER B PRIVATE KEY",
  stake_on_open: 6000000000000000, // must be greater than 6000000000000000
  intermediateTimes: [],
  microtransaction_amount: 100000000
}

const blockchainData = {
  userA_address: "USER A ADDRESS",
  userA_privateKey: "USER A PRIVATE KEY",
  userB_address: "USER B ADDRESS",
  transaction_amount: 100000000,
  number_of_transactions_to_be_tested: 'NUMBER OF TRANSACTIONS'
}

module.exports = {
  ethereumNetwork,
  stateServiceEndpoints,
  testFrameworkEndpoints,
  stateChannelData,
  blockchainData
};