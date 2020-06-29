const BN = require('bn.js');
const debug = require('debug')('app');
const { DAppDhx: { getBalanceDhx, getBalanceFaucetDhx } } = require('../helpers/contractDhx.js');
const { HARBOUR_DHX_REQUESTOR_SUFFICIENT_BALANCE, HARBOUR_DHX_FAUCET_SUFFICIENT_BALANCE } = require('../constants');

const checkBalanceRequestorDhx = async (req, res, next) => {
  try {
    debug('Middleware to check Harbour DHX balance of requestors DataHighway address');
    const balanceDhx = await getBalanceDhx(req.query.address);
    res.locals.isBalanceRequestorLowDhx = true;
    const sufficientBalanceBN = HARBOUR_DHX_REQUESTOR_SUFFICIENT_BALANCE;
    if (balanceDhx.gt(sufficientBalanceBN)) {
      res.locals.isBalanceRequestorLowDhx = false;
    }
  } catch (error) {
    if (error) {
      console.error('Error checking balance of Harbour DHX with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

const checkBalanceFaucetDhx = async (req, res, next) => {
  try {
    debug('Middleware to check Harbour DHX balance of faucet DataHighway address');
    const balanceDhx = await getBalanceFaucetDhx();
    res.locals.isBalanceFaucetLowDhx = true;
    const sufficientBalanceBN = HARBOUR_DHX_FAUCET_SUFFICIENT_BALANCE;
    if (balanceDhx.gt(sufficientBalanceBN)) {
      res.locals.isBalanceFaucetLowDhx = false;
    }
  } catch (error) {
    if (error) {
      console.error('Error checking balance of Harbour DHX with middleware: ', error);
      next(error);
      return;
    }
  }
  next();
}

module.exports = {
  checkBalanceFaucetDhx: checkBalanceFaucetDhx,
  checkBalanceRequestorDhx: checkBalanceRequestorDhx
}
