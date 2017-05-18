// const express = require('express');
// const app = express();
// const request = require('request');
// const fs = require('fs');
//
// app.get('/', function (request, response) {
//   response.send('Hello World');
// });
//
// var server = app.listen(3000, function () {
//   var host = server.address().address
//   var port = server.address().port
//
//   console.log("Server listening at http://%s:%s", host, port);
// });
// const options = {
//   method: 'POST',
//   url: 'https://modeanalytics.com/api/myleschatman/reports/688c4a4bb73c/runs',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cache-Control': 'no-cache',
//     'Authorization': 'Basic MDc5MmY1NzAyMjJiOmMyY2MzYzA2ZWM3ZTQ1ZWVkNWFmMTI3ZQ=='
//   },
//   body: {
//     report: {
//       name: 'Housing Units',
//       description: '',
//       report_run: {
//         limit: {
//           selected: false,
//           value: 100
//         }
//       },
//       'queries[]': [
//         {
//           create_query_run: true,
//           limit: false,
//           data_source_id: 1,
//           name: 'Query 1',
//           raw_query: 'select * from tutorial.city_populations limit 25',
//           token: '0d16eb6c780e'
//         }
//       ]
//     },
//     trk_source: 'editor'
//   },
//   json: true
// };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
// });
