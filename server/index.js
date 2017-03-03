const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const Metascraper = require('metascraper');


// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../teletobit/build')));

// Answer API requests.
// app.get('/api', function (req, res) {
//   res.send('{"message":"Hello from the custom server!"}');
// });


// Answer API requests.
app.get('/b/:url', function (req, res) {
    // Get meta data from URL
    Metascraper
        .scrapeUrl(req.params.url)
        .then((metadata) => {
            res.set('Content-Type', 'application/json');
            res.send(metadata);
        })
        .catch((error) => {
            console.log("fail");
            res.status(500).send({ error: error })
        })
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../teletobit/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
