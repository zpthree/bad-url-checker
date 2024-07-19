const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Bad URL Checker',
  });
});

app.post('/check-url', async (req, res) => {
  const data = req.body;
  const url = data.url;

  const response = await fetch(url);
  const status = response.status;

	return res.json({ status });
})

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Bad URL Checker has started on port: ${port}`);
});
