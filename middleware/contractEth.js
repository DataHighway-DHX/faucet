const BN = require('bn.js');
const { debugLog, debugInfo, debugError } = require('../utils/debug.js');
const { DApp: { getBalanceEth, getBalanceFaucetEth } } = require('../helpers/contract.js');
const { ROPSTEN_ETH_REQUESTOR_SUFFICIENT_BALANCE, ROPSTEN_ETH_FAUCET_SUFFICIENT_BALANCE } = require('../constants');

const checkBalanceRequestorEth = async (req, res, next) => {
  try {
    debugLog('Middleware to check Ropsten ETH balance of requestors Ethereum address');
    const balanceEth = await getBalanceEth(req.query.address);
    res.locals.isBalanceRequestorLowEth = true;
    const sufficientBalanceBN = ROPSTEN_ETH_REQUESTOR_SUFFICIENT_BALANCE;
    if (balanceEth.gt(sufficientBalanceBN)) {
      res.locals.isBalanceRequestorLowEth = false;
    }
  } catch (error) {
    if (error) {
      debugError('Error checking balance of Ropsten ETH with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

const checkBalanceFaucetEth = async (req, res, next) => {
  try {
    debugLog('Middleware to check Ropsten ETH balance of faucet Ethereum address');
    const balanceEth = await getBalanceFaucetEth();
    res.locals.isBalanceFaucetLowEth = true;
    const sufficientBalanceBN = ROPSTEN_ETH_FAUCET_SUFFICIENT_BALANCE;
    if (balanceEth.gt(sufficientBalanceBN)) {
      res.locals.isBalanceFaucetLowEth = false;
    }
  } catch (error) {
    if (error) {
      debugError('Error checking balance of Ropsten ETH with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

module.exports = {
  checkBalanceFaucetEth: checkBalanceFaucetEth,
  checkBalanceRequestorEth: checkBalanceRequestorEth
}
