const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const Metascraper = require('metascraper');
const franc = require('franc');
const teletobitTranslate = require('./util/translate');
// gzip the static resources before seding to browser, if the browser supports gzip compression
// Verification : Observe the response header Content-Encoding: gzip
app.use(compression());

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../teletobit/build')));

// Answer API requests.
// app.get('/api/:url', function (req, res) {
//   res.send(req.params.url);
// });

// Answer API requests.
app.get('/b', (req, res) => {
    // Get meta data from URL
    Metascraper
        .scrapeUrl(req.query.url)
        .then((metadata) => {
            const inputLocale = franc(metadata.description);
            if(inputLocale !== 'kor' && inputLocale !== 'und') {
                teletobitTranslate(metadata).then((translateResult) => {
                    res.set('Content-Type', 'application/json');
                    res.send(translateResult);
                });
            } else {
                res.set('Content-Type', 'application/json');
                res.send({
                    title: metadata.title,
                    description: metadata.description,
                    source: metadata.publisher                  
                });
            }
        }).catch((error) => {
            console.log("fail");
            res.status(500).send({ error: error })
        });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../teletobit/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
