const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api');
const BN = require('bn.js');
const debug = require('debug')('app');

const {
  HARBOUR_DHX_CHAIN_ENDPOINT,
  HARBOUR_DHX_FAUCET_TO_SEND,
  HARBOUR_DHX_CUSTOM_TYPES_URL
} = require('../constants');

const getCustomTypesDhx = async () => {
  const url = HARBOUR_DHX_CUSTOM_TYPES_URL;
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.status !== 200) {
    throw new Error(response.statusText);
    return;
  };
  const json = await response.json();
  // debug('json', json);
  return json;
}

const DAppDhx = {
  api: null,
  chainEndpoint: null,
  chainMnemonic: null,
  faucetAccount: null,
  keyring: null,
  provider: null,
  init: async () => {
    DAppDhx.chainEndpoint = HARBOUR_DHX_CHAIN_ENDPOINT;
    DAppDhx.chainMnemonic = process.env.MNENOMIC_DATAHIGHWAY;
    DAppDhx.provider = new WsProvider(HARBOUR_DHX_CHAIN_ENDPOINT);
    // Create a keyring instance. https://polkadot.js.org/api/start/keyring.html
    DAppDhx.keyring = new Keyring({ type: 'sr25519' });
    DAppDhx.api = await ApiPromise.create({
      provider: DAppDhx.provider,
      // https://polkadot.js.org/api/api/#registering-custom-types
      types: await getCustomTypesDhx()
    });
    DAppDhx.faucetAccount = DAppDhx.keyring.addFromMnemonic(DAppDhx.chainMnemonic);
    DAppDhx.getBlock();
  },
  getBalanceDhx: async (dhxAddress) => {
    // Retrieve account nonce and balances
    // https://polkadot.js.org/api/start/api.query.html
    const [{ nonce, data: balance }] = await Promise.all([
      DAppDhx.api.query.system.account(dhxAddress)
    ]);
    const balanceBN = new BN(balance.free, 10);
    const nonceBN = new BN(nonce, 10);
    debug(`Balance of ${balanceBN.toString()} and a nonce of ${nonceBN.toString()}`);
    return balanceBN;
  },
  getBalanceFaucetDhx: async () => {
    const { nonce, data: balance } =
      await DAppDhx.api.query.system.account(DAppDhx.faucetAccount.address);
    const balanceBN = new BN(balance.free, 10);
    const nonceBN = new BN(nonce, 10);
    debug(`Balance of faucet is ${balanceBN.toString()} and a nonce of ${nonceBN.toString()}`);
    return balanceBN;
  },
  getBlock: async () => {
    await DAppDhx.api.rpc.chain.subscribeNewHeads(async (header) => {
      let currentBlockNumber = header.number.toString();

      const [blockHash] = await Promise.all([
        DAppDhx.api.rpc.chain.getBlockHash(currentBlockNumber),
      ]);

      const [signedBlock] = await Promise.all([
        DAppDhx.api.rpc.chain.getBlock(blockHash)
      ]);
      // debug('signedBlock', signedBlock.block.header.parentHash.toHex());
      // For additional, see: https://github.com/ltfschoen/flappytips/blob/master/src/Game.js
    });
  },
  sendTransactionDhx: async (to) => {
    debug('Recipient: ', to);
    debug('Sending DataHighway Harbour DHX. Please wait...');
    // Show Ethereum address associated with mnemonic
    const amount = HARBOUR_DHX_FAUCET_TO_SEND;
    const transfer = DAppDhx.api.tx.balances.transfer(to, amount);
    const transactionHash = await transfer.signAndSend(DAppDhx.faucetAccount);
    const transactionHashHex = transactionHash.toHex();
    debug('Transaction hash: ', transactionHashHex);
    return {
      // FIXME - use subscan.io or polkascan.io to provide url
      transactionHashUrl: transactionHashHex
    };
  }
};

DAppDhx.init();

module.exports = {
  DAppDhx
};
