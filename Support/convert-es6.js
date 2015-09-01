#!/usr/bin/env node

var transform = require('jstransform').transform;

getINPUT(function(error, code){
  process.stdout.write(
    transform(
      (
        []
          .concat(require('jstransform/visitors/type-syntax').visitorList)
          .concat(require('jstransform/visitors/es6-arrow-function-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-object-concise-method-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-object-short-notation-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-class-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-rest-param-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-template-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-destructuring-visitors').visitorList)
          .concat(require('jstransform/visitors/es6-call-spread-visitors').visitorList)
          .concat(require('jstransform/visitors/es7-spread-property-visitors').visitorList)
      ),
      code.replace(/^#/gm,'//HASH//#')
    ).code.replace(/\/\/HASH\/\//g,'')
  );
});

/////////////////////////////////////////////////////////////////////////////////

function getINPUT(callback){
  var INPUT = [];
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      INPUT.push(chunk);
    }
  });
  process.stdin.on('end', function() {
    callback(null, INPUT.join(''));
  });
}
