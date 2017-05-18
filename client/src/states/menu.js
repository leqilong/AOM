'use strict';

exports.create = function() {
  var div = document.getElementById('content');
  var input = document.createElement('textarea');
  var button = document.createElement('button');

  input.name = 'post';
  input.cols = '120';
  input.rows = '4';

  div.appendChild(input);
  div.appendChild(button);
};
