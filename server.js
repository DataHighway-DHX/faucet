require('dotenv').config()
const debug = require('debug')('app');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const { DApp: {
  web3, provider, contractInstanceMXC, sendTransactionEth, sendTransactionMxc
} } = require('./helpers/contract.js');
// debug('provider', provider);
// debug('contract', contractInstanceMXC);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Example: http://localhost:5000/api/faucet/eth/ropsten?address=0x1f7ace08af5c49a5d69fbb98fb9339a729b27161
 */
app.get('/api/faucet/eth/ropsten', async (req, res, next) => {
  // Handle error in async function
  try {
    const to = req.query.address;
    const { transactionHashUrl } = await sendTransactionEth(to);
    res.send({
      result: 'Ropsten Ether sent',
      tx: transactionHashUrl
    });
  } catch (error) {
    debug(error);
    // Handle error by Express or pass to custom error handler
    // return next(error); // Crashes
    return;
  }
});

/**
 * Example: http://localhost:5000/api/faucet/mxc/ropsten?address=0x1f7ace08af5c49a5d69fbb98fb9339a729b27161
 */
app.get('/api/faucet/mxc/ropsten', async (req, res, next) => {
  // Handle error in async function
  try {
    const to = req.query.address;
    const { transactionHashUrl } = await sendTransactionMxc(to);
    res.send({
      result: 'Ropsten MXC ERC-20 sent',
      tx: transactionHashUrl
    });
  } catch (error) {
    debug(error);
    // Handle error by Express or pass to custom error handler
    // return next(error); // Crashes
    return;
  }
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `Received POST request: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
