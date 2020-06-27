# Setup

```
nvm use;
yarn global add nodemon;
yarn dev;
```

http://localhost:3000

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