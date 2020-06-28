# Usage

* Go to https://datahighway.herokuapp.com
* Choose faucet:
  * Ropsten Testnet ETH
  * MXC ERC-20 tokens
* Enter Ethereum Address to receive
* Click Submit

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

https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
https://github.com/w3f/faucet-bot
https://zellwk.com/blog/async-await-express/