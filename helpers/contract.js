const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const TruffleContract = require("@truffle/contract");
const BN = require('bn.js');
const debug = require('debug')('app');

const DApp = {
  contractAddressMXC: null,
  contractInstanceMXC: null,
  contractJSONMXC: null,
  coinbase: null,
  init: async () => {
    DApp.infuraHttpProvider = 'https://ropsten.infura.io/v3/' + process.env.INFURA_API_PROJECT_ID;
    DApp.provider = new HDWalletProvider(process.env.MNENOMIC, DApp.infuraHttpProvider);
    DApp.web3 = new Web3(DApp.provider);
    DApp.contractAddressMXC = process.env.CONTRACT_ADDRESS_MXC_TESTNET;
    DApp.contractJSONMXC = JSON.parse(fs.readFileSync('./assets/data/MXCToken.json').toString());
    DApp.contractInstanceMXC = TruffleContract(DApp.contractJSONMXC);
    DApp.contractInstanceMXC.setProvider(DApp.provider);
    // Use .deployed() instead when using development chain
    DApp.contractInstanceMXC.at(DApp.contractAddressMXC);
    DApp.coinbase = await DApp.web3.eth.getCoinbase();
    DApp.getBlock();
  },
  infuraHttpProvider: null,
  getBlock: async () => {
    // FIXME - encounter same error as here https://github.com/MetaMask/web3-provider-engine/issues/313
    // so web3.eth needs a fix similar to the one MetaMask made (i.e. `getBlockByNumberWithRetry`)
    // consider switching to using https://github.com/MetaMask/web3-provider-engine
    // const block = await DApp.web3.eth.getBlock("latest");
    // debug('Current block: ', block.timestamp);
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
  sendTransactionMxc: async (to) => {
    debug('Recipient: ', to);
    debug('Sending Funds. Please wait...');
    // Show Ethereum address associated with mnemonic
    const amount = new BN(1, 10);
    // https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#towei
    // const approved = await DApp.contractInstanceMXC.methods.approve(DApp.coinbase,  amount);
    DApp.contractInstanceMXC.at(DApp.contractAddressMXC);
    const transactionHash = await DApp.contractInstanceMXC.methods.transfer(
      to.toLowerCase(),
      amount
    )
    debug('transactionHash', transactionHash);

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
