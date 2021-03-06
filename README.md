# Usage

* Go to https://datahighway.herokuapp.com
* Choose faucet:
  * Ropsten Testnet ETH
  * MXC ERC-20 tokens
* Enter Ethereum Address to receive
* Click Submit

Note: Faucet only works when:
* Requestor's Ropsten ETH balance < 1 MXC
* Requestor's Ropsten MXC ERC-20 token balance < 1 MXC
* Faucet's Ropsten ETH balance > 0.01 ETH
* Faucet's Ropsten MXC ERC-20 token balance > 0.01 MXC
* Requestor's Ethereum address that is not a smart contract, otherwise out of gas error may occur, since only a limited gas price has been catered for.

# Development

* Install dependencies and run server and front-end.
```
nvm use;
yarn global add nodemon;
DEBUG=app yarn dev;
```

* Go to http://localhost:3000
* Enter your Ethereum address to receive either Ropsten Testnet ETH or MXC ERC-20 tokens

# Maintenance

## Deploy (Heroku)

```
heroku login
heroku apps:create datahighway
git push -f heroku master
```

Set Heroku Environment Variables to match the contents of the .env file. Replace missing values below:
```
heroku config:set \
  ETHEREUM_ADDRESS=0x \
  MNENOMIC="" \
  INFURA_API_PROJECT_ID="" \
  CONTRACT_ADDRESS_MXC_TESTNET=0x7d3037fa9f8f253e4e7fc930f0a299cbd6eac349 \
  MNENOMIC_DATAHIGHWAY="bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice" \
  HARBOUR_DHX_CUSTOM_TYPES_UR=https://raw.githubusercontent.com/DataHighway-DHX/node/master/custom_types.json
```

Open the production website
```
heroku open
```

## Debug

```
heroku ps:scale web=1:free
heroku ps:scale web=2:standard-2x
heroku ps
heroku open
heroku logs --tail
heroku restart
heroku ps:stop web
```

# References

* https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
* https://github.com/w3f/faucet-bot
* https://zellwk.com/blog/async-await-express/