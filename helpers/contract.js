const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BN = require('bn.js');
const debug = require('debug')('app');

const DApp = {
  contractInstanceMXC: null,
  contractJSONMXC: null,
  coinbase: null,
  init: async () => {
    DApp.infuraHttpProvider = 'https://ropsten.infura.io/v3/' + process.env.INFURA_API_PROJECT_ID;
    DApp.provider = new HDWalletProvider(process.env.MNENOMIC, DApp.infuraHttpProvider);
    DApp.web3 = new Web3(DApp.provider);
    DApp.contractJSONMXC = JSON.parse(fs.readFileSync('./assets/data/MXCToken.json').toString());
    DApp.contractInstanceMXC = new DApp.web3.eth.Contract(DApp.contractJSONMXC, process.env.CONTRACT_ADDRESS_MXC_TESTNET,
      { gasPrice: '45000', from: process.env.ETHEREUM_ADDRESS });
    DApp.contractInstanceMXC.setProvider(DApp.provider);
    DApp.coinbase = await DApp.web3.eth.getCoinbase();
    DApp.getBlock();
  },
  infuraHttpProvider: null,
  getBlock: async () => {
    const block = await DApp.web3.eth.getBlock("latest");
    debug('Current block: ', block.timestamp);
  },
  provider: null,
  sendTransactionEth: async (to) => {
    debug('Recipient: ', to);
    debug('Sending Funds. Please wait...');
    // Show Ethereum address associated with mnemonic
    const amount = new BN(1, 10);
    // https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#towei
    const transactionHash = await DApp.web3.eth.sendTransaction({
      from: DApp.coinbase,
      to: to.toLowerCase(),
      value: DApp.web3.utils.toWei(amount, 'wei'),
      gas: 21000
    })
      .then((receipt) => {
        debug('Transaction receipt', receipt);

        return receipt.transactionHash;
      });

    return {
      transactionHashUrl: `https://ropsten.etherscan.io/tx/${transactionHash}`
    };
  },
  web3: null,
};

DApp.init();

module.exports = {
  DApp
};
