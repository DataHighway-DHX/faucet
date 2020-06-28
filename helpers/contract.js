const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BN = require('bn.js');
const debug = require('debug')('app');

const { ROPSTEN_ETH_FAUCET_TO_SEND, ROPSTEN_MXC_FAUCET_TO_SEND } = require('../constants');

const DApp = {
  contractAddressMXC: null,
  contractInstanceMXC: null,
  contractJSONMXCABI: null,
  coinbase: null,
  init: async () => {
    DApp.infuraHttpProvider = 'https://ropsten.infura.io/v3/' + process.env.INFURA_API_PROJECT_ID;
    DApp.provider = new HDWalletProvider(process.env.MNENOMIC, DApp.infuraHttpProvider);
    DApp.web3 = new Web3(DApp.provider);
    DApp.coinbase = await DApp.web3.eth.getCoinbase();
    DApp.initMxc();
    DApp.getBlock();
  },
  initMxc: async () => {
    DApp.contractAddressMXC = process.env.CONTRACT_ADDRESS_MXC_TESTNET;
    DApp.contractJSONMXCABI = JSON.parse(fs.readFileSync('./assets/data/MXCToken.json').toString());
    DApp.contractInstanceMXC = await new DApp.web3.eth.Contract(DApp.contractJSONMXCABI, DApp.contractAddressMXC);
    DApp.contractInstanceMXC.setProvider(DApp.provider);
  },
  infuraHttpProvider: null,
  getBalanceEth: async (ethAddress) => {
    const balance = await DApp.web3.eth.getBalance(ethAddress);
    const balanceBN = new BN(balance, 10);
    const balanceEth = await DApp.web3.utils.fromWei(balanceBN);
    debug('Balance ETH: ', balanceEth);
    debug('Balance Wei: ', balanceBN.toString());
    return balanceBN;
  },
  getBalanceFaucetEth: async () => {
    const balance = await DApp.web3.eth.getBalance(DApp.coinbase);
    const balanceBN = new BN(balance, 10);
    const balanceEth = await DApp.web3.utils.fromWei(balanceBN);
    debug('Balance Faucet ETH: ', balanceEth);
    debug('Balance Faucet Wei: ', balanceBN.toString());
    return balanceBN;
  },
  getBalanceMxc: async (ethAddress) => {
    const balance = await DApp.contractInstanceMXC.methods.balanceOf(ethAddress).call();
    const balanceBN = new BN(balance, 10);
    debug('Balance MXC ERC-20: ', balanceBN.toString());
    return balanceBN;
  },
  getBalanceFaucetMxc: async () => {
    const balance = await DApp.contractInstanceMXC.methods.balanceOf(DApp.coinbase).call();
    const balanceBN = new BN(balance, 10);
    debug('Balance Faucet MXC ERC-20: ', balanceBN.toString());
    return balanceBN;
  },
  getBlock: async () => {
    const block = await DApp.web3.eth.getBlock("latest");
    debug('Current block: ', block.timestamp);
  },
  provider: null,
  sendTransactionEth: async (to) => {
    debug('Recipient: ', to);
    debug('Sending Ropsten Eth. Please wait...');
    // Show Ethereum address associated with mnemonic
    const amount = new BN(ROPSTEN_ETH_FAUCET_TO_SEND, 10);
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
    debug('Sending MXC ERC-20 tokens. Please wait...');
    // Show Ethereum address associated with mnemonic
    const amount = new BN(ROPSTEN_MXC_FAUCET_TO_SEND, 10);
    // https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#towei
    const balance = await DApp.contractInstanceMXC.methods.balanceOf(DApp.coinbase).call();
    debug('Faucet balance: ', balance);

    const transactionHash = await DApp.contractInstanceMXC.methods.transfer(to.toLowerCase(), amount)
      .send({
        from: DApp.coinbase,
        // https://ethgasstation.info/
        gas: 200000,
        gasPrice: 30000000000
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
