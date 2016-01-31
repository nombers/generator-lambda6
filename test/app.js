'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-lambda-6:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        appname: 'lambda6-test',
        version: '0.0.1',
        description: 'A test project for the Yeoman generator',
        role: 'arn:::aws:...'
      })
      .on('end', done);
  });

  it('creates the correct files', function () {
    assert.file([
      '.babelrc',
      '.codeclimate.yml',
      '.eslintignore',
      '.eslintrc',
      '.gitignore',
      '.npmignore',
      '.travis.yml',
      'esdoc.json',
      'gulpfile.babel.js',
      'index.js',
      'lambda.json',
      'package.json',
      'README.md',
      'src/handler.js',
      'src/index.js',
      'test/test.js'
    ]);
  });
});
