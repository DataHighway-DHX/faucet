const BN = require('bn.js');

const { DApp: { getBalanceMxc, getBalanceFaucetMxc } } = require('../helpers/contract.js');
const { ROPSTEN_MXC_REQUESTOR_SUFFICIENT_BALANCE, ROPSTEN_MXC_FAUCET_SUFFICIENT_BALANCE } = require('../constants');

const checkBalanceRequestorMxc = async (req, res, next) => {
  try {
    console.log('Middleware to check Ropsten MXC ERC-20 balance of requestors Ethereum address');
    const balanceMxc = await getBalanceMxc(req.query.address);
    req.isBalanceRequestorLowMxc = true;
    if (balanceMxc.gt(ROPSTEN_MXC_REQUESTOR_SUFFICIENT_BALANCE)) {
      req.isBalanceRequestorLowMxc = false;
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
    console.log('Middleware to check Ropsten MXC ERC-20 balance of faucet Ethereum address');
    const balanceMxc = await getBalanceFaucetMxc();
    req.isBalanceFaucetLowMxc = true;
    if (balanceMxc.gt(ROPSTEN_MXC_FAUCET_SUFFICIENT_BALANCE)) {
      req.isBalanceFaucetLowMxc = false;
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
