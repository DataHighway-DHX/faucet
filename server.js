const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

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

app.listen(port, () => console.log(`Listening on port ${port}`));
