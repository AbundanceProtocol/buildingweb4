require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
const fs = require('fs')
const privateKey = fs.readFileSync('.secret').toString()

module.exports = {
  solidity: "0.8.12",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff
    },
    localhost: {
      chainId: 1337,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff
    },
    mumbai: {
      url: 'https://speedy-nodes-nyc.moralis.io/b2f47405025640251edf7a57/polygon/mumbai',
      accounts: [privateKey]
    },
    polygon: {
      url: 'https://speedy-nodes-nyc.moralis.io/b2f47405025640251edf7a57/polygon/mainnet',
      accounts: [privateKey]
    }
  }
};
