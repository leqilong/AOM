var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

const options = {
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
           raw_query: 'select * from tutorial.city_populations limit 25',
           token: '0d16eb6c780e'
         }
       ]
     },
     trk_source: 'editor'
   },
   json: true
 };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
// });

module.exports = router;