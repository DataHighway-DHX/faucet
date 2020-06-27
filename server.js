require('dotenv').config()
const debug = require('debug')('app')
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

let infuraHttpProvider = "https://ropsten.infura.io/v3/" + process.env.INFURA_API_PROJECT_ID;
let provider = new HDWalletProvider(process.env.MNENOMIC, infuraHttpProvider);
const web3 = new Web3(provider);
// Show Ethereum address associated with mnemonic
web3.eth.getCoinbase()
  .then(debug);

// Show latest block
(async () => {
  const block = await web3.eth.getBlock("latest");
  debug('Current block: ', block.timestamp);
  process.exit(0);
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Express' });
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
