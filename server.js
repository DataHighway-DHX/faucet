require('dotenv').config()
const debug = require('debug')('app')
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const BN = require('bn.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

let infuraHttpProvider = "https://ropsten.infura.io/v3/" + process.env.INFURA_API_PROJECT_ID;
let provider = new HDWalletProvider(process.env.MNENOMIC, infuraHttpProvider);
const web3 = new Web3(provider);
// Show latest block
(async () => {
  const block = await web3.eth.getBlock("latest");
  debug('Current block: ', block.timestamp);
  // process.exit(0);
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Example: http://localhost:5000/api/faucet?address=0x1f7ace08af5c49a5d69fbb98fb9339a729b27161
 */
app.get('/api/faucet', async (req, res, next) => {
  // Handle error in async function
  try {
    const to = req.query.address;
    debug('Recipient: ', to);
    debug('Sending Funds. Please wait...');
    // Show Ethereum address associated with mnemonic
    const who = await web3.eth.getCoinbase();
    const amount = new BN(1, 10);
    // https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#towei
    await web3.eth.sendTransaction({ from: who, to: to.toLowerCase(), value: web3.utils.toWei(amount, 'wei'), gas: 21000 })
      .then((receipt) => {
        debug('Transaction receipt', receipt);
        res.send({
          result: 'Ropsten Ether sent',
          tx: `https://ropsten.etherscan.io/tx/${receipt.transactionHash}`
        });
      });
  } catch (error) {
    debug("Error: ", error);
    // Handle error by Express or pass to custom error handler
    return next(error);
  }
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
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
