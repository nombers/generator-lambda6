'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

/**
 * Helper function to copy a set of files with contexts, preserving file names.
 * @param {Object} - an object of key (file names) and values (contexts).
 * @return {Object} - a hash with functions to generate files.
 */
function copyFilesWithContexts(files) {
  function _copy(src, dest, context) {
    return function() {
      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(dest),
        context instanceof Function ? context.call(this) : context
      );
    };
  }
  var obj = {};
  for (var key in files) {
    const opts = files[key];
    // If value is string, just copy directly
    if (typeof opts === 'string') {
      obj[key] = _copy(opts, opts);
      continue;
    }
    // Otherwise expect an object and throw if it isn't one
    if (!(opts instanceof Object)) {
      throw new TypeError('invalid options, must be object: ' + opts);
    }
    obj[key] = _copy(opts.src, opts.dest, opts.context);
  }
  return obj;
}

function getSomething() {
  console.log(this);
  return {
    babelrc: function() {
      this.fs.copyTpl(
        this.templatePath('.babelrc'),
        this.destinationPath('.babelrc')
      );
    }
  };
}

function validateServiceName(input) {
  if (typeof input !== 'string') {
    this.log.error(chalk.red('\nInvalid service name, must be a string'));
    return false;
  }
  const re = /^[a-zA-Z0-9-_]+$/;
  if (re.test(input)) {
    return true;
  }
  this.log.error(chalk.red('\nInvalid service name, must match ' + re.toString()));
  return false;
}

function getContext() {
  return {
    appName: 'appName'
  };
}

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Firing up the Nombers ' + chalk.magenta('lambda6') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'serviceName',
      message: 'What is this microservice (Lambda function) going to be called?',
      // validate: /^[a-zA-Z0-9-_]+$/.test,
      validate: validateServiceName.bind(this),
      default: _.camelCase(this.appname)
    },{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: copyFilesWithContexts({
    // Babel
    babelrc:      { src: '_.babelrc',         dest: '.babelrc' },
    // ESLint
    eslintignore: { src: '_.eslintignore',    dest: '.eslintignore' },
    eslintrc:     { src: '_.eslintrc',        dest: '.eslintrc' },
    // Git
    gitignore:    { src: '_.gitignore',       dest: '.gitignore' },
    // Gulpfile and
    gulpfile:     { src: 'gulpfile.ejs',      dest: 'gulpfile.babel.js', context: getContext.call(this) },
    package:      { src: 'package.ejs',       dest: 'package.json',      context: getContext.call(this) },
    // JavaScript Source Code
    index:        { src: 'index.js',          dest: 'index.js' },
    src_handler:  { src: 'src/handler.js',    dest: 'src/handler.js' },
    src_index:    { src: 'src/index.js',      dest: 'src/index.js' },
    test_test:    { src: 'test/test.js',      dest: 'test/test.js' },
    // Travis CI and CodeClimate
    travis:       { src: '_.travis.yml',      dest: '.travis.yml' },
    codeclimate:  { src: '_.codeclimate.yml', dest: '.codeclimate.yml' },
  }),

  install: function () {
    this.npmInstall();
  }
});
