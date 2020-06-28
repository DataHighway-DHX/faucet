require('dotenv').config()
const debug = require('debug')('app');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const contractMiddlewareEth = require('./middleware/contractEth.js');
const contractMiddlewareMxc = require('./middleware/contractMxc.js');
const { DApp: {
  web3, provider, contractInstanceMXC, sendTransactionEth, sendTransactionMxc
} } = require('./helpers/contract.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Example: http://localhost:5000/api/faucet/eth/ropsten?address=<ETHEREUM_ADDRESS>
 */
app.get('/api/faucet/eth/ropsten',
  // Middleware chain
  async (req, res, next) => {
    console.log('Checking Ethereum account balance of requestor');
    await contractMiddlewareEth.checkBalanceRequestorEth(req, res, next);
    console.log('Checking Ethereum account balance of faucet');
    await contractMiddlewareEth.checkBalanceFaucetEth(req, res, next);
  },
  async (req, res, next) => {
    if (!req.isBalanceRequestorLowEth) {
      res.send({ message: 'Ropsten Ether balance of requestor already deemed sufficient' });
      return;
    }
    if (req.isBalanceFaucetLowEth) {
      res.send({ message: 'Ropsten Ether balance of faucet depleted. Please try again later.' });
      return;
    }
    // Handle error in async function
    try {
      const to = req.query.address;
      const { transactionHashUrl } = await sendTransactionEth(to);
      res.send({
        message: 'Ropsten Ether sent',
        tx: transactionHashUrl
      });
    } catch (error) {
      debug(error);
      return;
    }
  }
);

/**
 * Example: http://localhost:5000/api/faucet/mxc/ropsten?address=<ETHEREUM_ADDRESS>
 */
app.get('/api/faucet/mxc/ropsten',
  // Middleware chain
  async (req, res, next) => {
    console.log('Checking MXC ERC-20 token account balance of requestor');
    await contractMiddlewareMxc.checkBalanceRequestorMxc(req, res, next);
    console.log('Checking MXC ERC-20 token account balance of faucet');
    await contractMiddlewareMxc.checkBalanceFaucetMxc(req, res, next);
  },
  async (req, res, next) => {
    if (!req.isBalanceRequestorLowMxc) {
      res.send({ message: 'Ropsten MXC ERC-20 token balance of requestor already deemed sufficient' });
      return;
    }
    if (req.isBalanceFaucetLowMxc) {
      res.send({ message: 'Ropsten MXC ERC-20 token balance of faucet depleted. Please try again later.' });
      return;
    }
    // Handle error in async function
    try {
      const to = req.query.address;
      const { transactionHashUrl } = await sendTransactionMxc(to);
      res.send({
        message: 'Ropsten MXC ERC-20 sent',
        tx: transactionHashUrl
      });
    } catch (error) {
      debug(error);
      return;
    }
  }
);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
