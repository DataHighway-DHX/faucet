const BN = require('bn.js');
const debug = require('debug')('app');
const { DApp: { getBalanceMxc, getBalanceFaucetMxc } } = require('../helpers/contract.js');
const { ROPSTEN_MXC_REQUESTOR_SUFFICIENT_BALANCE, ROPSTEN_MXC_FAUCET_SUFFICIENT_BALANCE } = require('../constants');

const checkBalanceRequestorMxc = async (req, res, next) => {
  try {
    debug('Middleware to check Ropsten MXC ERC-20 balance of requestors Ethereum address');
    const balanceMxc = await getBalanceMxc(req.query.address);
    res.locals.isBalanceRequestorLowMxc = true;
    if (balanceMxc.gt(ROPSTEN_MXC_REQUESTOR_SUFFICIENT_BALANCE)) {
      res.locals.isBalanceRequestorLowMxc = false;
    }
  } catch (error) {
    if (error) {
      console.error('Error checking balance of MXC ERC-20 with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

const checkBalanceFaucetMxc = async (req, res, next) => {
  try {
    debug('Middleware to check Ropsten MXC ERC-20 balance of faucet Ethereum address');
    const balanceMxc = await getBalanceFaucetMxc();
    res.locals.isBalanceFaucetLowMxc = true;
    if (balanceMxc.gt(ROPSTEN_MXC_FAUCET_SUFFICIENT_BALANCE)) {
      res.locals.isBalanceFaucetLowMxc = false;
    }
  } catch (error) {
    if (error) {
      console.error('Error checking balance of MXC ERC-20 with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

module.exports = {
  checkBalanceFaucetMxc: checkBalanceFaucetMxc,
  checkBalanceRequestorMxc: checkBalanceRequestorMxc
}
