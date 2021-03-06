require('dotenv').config()
const debug = require('debug')('app');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
global.fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 5000;
const contractMiddlewareEth = require('./middleware/contractEth.js');
const contractMiddlewareMxc = require('./middleware/contractMxc.js');
const contractMiddlewareDhx = require('./middleware/contractDhx.js');
const { DApp: { sendTransactionEth, sendTransactionMxc } } = require('./helpers/contract.js');
const { DAppDhx: { sendTransactionDhx } } = require('./helpers/contractDhx.js');

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
  },
  async (req, res, next) => {
    console.log('Checking Ethereum account balance of faucet');
    await contractMiddlewareEth.checkBalanceFaucetEth(req, res, next);
  },
  async (req, res, next) => {
    if (!res.locals.isBalanceRequestorLowEth) {
      res.send({ message: 'Ropsten Ether balance of requestor already deemed sufficient' });
      return;
    }
    if (res.locals.isBalanceFaucetLowEth) {
      res.send({ message: 'Ropsten Ether balance of faucet depleted. Please try again later.' });
      return;
    }
    // Handle error in async function
    try {
      const to = req.query.address;
      const { transactionHashUrl } = await sendTransactionEth(to);
      res.send({
        message: 'Ropsten Ether sent with transaction',
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
  },
  async (req, res, next) => {
    console.log('Checking MXC ERC-20 token account balance of faucet');
    await contractMiddlewareMxc.checkBalanceFaucetMxc(req, res, next);
  },
  async (req, res, next) => {
    if (!res.locals.isBalanceRequestorLowMxc) {
      res.send({ message: 'Ropsten MXC ERC-20 token balance of requestor already deemed sufficient' });
      return;
    }
    if (res.locals.isBalanceFaucetLowMxc) {
      res.send({ message: 'Ropsten MXC ERC-20 token balance of faucet depleted. Please try again later.' });
      return;
    }
    // Handle error in async function
    try {
      const to = req.query.address;
      const { transactionHashUrl } = await sendTransactionMxc(to);
      res.send({
        message: 'Ropsten MXC ERC-20 sent with transaction',
        tx: transactionHashUrl
      });
    } catch (error) {
      debug(error);
      return;
    }
  }
);

/**
 * Example: http://localhost:5000/api/faucet/dhx/harbour?address=<DATAHIGHWAY_ADDRESS>
 */
app.get('/api/faucet/dhx/harbour',
  // Middleware chain
  async (req, res, next) => {
    console.log('Checking DHX token account balance of requestor');
    await contractMiddlewareDhx.checkBalanceRequestorDhx(req, res, next);
  },
  async (req, res, next) => {
    console.log('Checking DHX token account balance of faucet');
    await contractMiddlewareDhx.checkBalanceFaucetDhx(req, res, next);
  },
  async (req, res, next) => {
    if (!res.locals.isBalanceRequestorLowDhx) {
      res.send({ message: 'Harbour DHX token balance of requestor already deemed sufficient' });
      return;
    }
    if (res.locals.isBalanceFaucetLowDhx) {
      res.send({ message: 'Harbour DHX token balance of faucet depleted. Please try again later.' });
      return;
    }
    // Handle error in async function
    try {
      const to = req.query.address;
      const { transactionHashUrl } = await sendTransactionDhx(to);
      res.send({
        message: 'Harbour DHX sent with transaction',
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
