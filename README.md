# Development

```
nvm use;
yarn global add nodemon;
DEBUG=app yarn dev;
```

## User Interface

Note: This is a work in progress. Please request via the API directly.

http://localhost:3000

## Request Ropsten Eth

* Go to http://localhost:5000/api/faucet/eth/ropsten?address=<ETHEREUM_ADDRESS>

## Request MXC ERC-20 Tokens

* Go to http://localhost:5000/api/faucet/mxc/ropsten?address=<ETHEREUM_ADDRESS>

# Deploy (Heroku)

```
heroku login
heroku apps:create faucet-mining
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