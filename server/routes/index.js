var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var fs = require('fs');
var https = require('https');
var zlib = require('zlib');
const hostname = 'https://modeanalytics.com';

var options = {
  method: 'POST',
  url: 'https://modeanalytics.com/api/myleschatman/reports/688c4a4bb73c/runs',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Authorization': 'Basic MDc5MmY1NzAyMjJiOmMyY2MzYzA2ZWM3ZTQ1ZWVkNWFmMTI3ZQ=='
  },
  body: {
    report: {
      name: 'Housing Units',
      description: '',
      report_run: {
        limit: {
          selected: false,
          value: 100
        }
      },
      'queries[]': [
        {
          create_query_run: true,
          limit: false,
          data_source_id: 1,
          name: 'Query 1',
          raw_query: '',
          token: '0d16eb6c780e'
        }
      ]
    },
    trk_source: 'editor'
  },
  json: true
};

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/submit', function(req, res, next) {
  const query = req.body.query;
  options.body.report['queries[]'][0].raw_query = query;

  request(options, function (error, response) {
    if (error) throw new Error(error);

    var url = response.body._links.content.href;
    url = hostname + url.slice(0, -3).concat('json');

    setTimeout(function() {
      https.get(url, function(response) {
        var gunzip = zlib.createGunzip();
        var jsonString = '';
        response.pipe(gunzip);
        gunzip.on('data', function(chunk) {
          jsonString += chunk;
        });
        gunzip.on('end', function() {
          fs.writeFile('level.json', jsonString, function(err) {
            if (err) throw err;
            console.log('File saved!');
          })
          console.log(jsonString);
        });
        gunzip.on('error', function(e) {
          console.log(e);
        });
      });
    }, 5000);

  });

  res.redirect('/');
});

module.exports = router;
