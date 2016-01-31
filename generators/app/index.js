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
    // Generate context (if function), or pass directly
    obj[key] = _copy(opts.src, opts.dest, opts.context);
  }
  return obj;
}

/**
 * Creates a function to validate an input against a regex and return an error
 * message if needed.
 * @param {RegExp} re - the regular expression to use
 * @returns {Function} function that accepts a string input and returns true if
 * the input is valid, false otherwise.
 */
function regexValidate(re) {
  return function(input) {
    if (re.test(input)) {
      return true;
    }
    this.log.error(chalk.red('\nInvalid input, must match ' + re.toString()));
    return false;
  }
}

/**
 * Gets the context used to generate some of the templates.
 */
function getContext() {
  if (!this) {
    throw new Error('expected this to have value');
  }
  // Called with this = generator
  return {
    name: this.opts.appname,
    role: this.opts.role,
    version: this.opts.version,
    description: this.opts.description
  };
}

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Firing up the Nombers ' + chalk.magenta('lambda6') + ' generator!'
    ));

    // Get package information
    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'Service/package name?',
      validate: regexValidate(/^[a-zA-Z0-9-_]+$/).bind(this),
      default: _.camelCase(this.appname)
    }, {
      type: 'input',
      name: 'version',
      message: 'Version?',
      validate: regexValidate(/^[0-9]+\.[0-9]+\.[0-9]+$/).bind(this),
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'description',
      message: 'Description?'
    }, {
      type: 'input',
      name: 'role',
      message: 'Role ARN?'
    }];

    this.prompt(prompts, function (props) {
      this.opts = props;
      done();
    }.bind(this));
  },

  writing: copyFilesWithContexts.call(this, {
    // Babel
    babelrc:      { src: '_.babelrc',         dest: '.babelrc' },
    // ESDoc
    esdoc:        { src: 'esdoc.json',        dest: 'esdoc.json' },
    // ESLint
    eslintignore: { src: '_.eslintignore',    dest: '.eslintignore' },
    eslintrc:     { src: '_.eslintrc',        dest: '.eslintrc' },
    // Git
    gitignore:    { src: '_.gitignore',       dest: '.gitignore' },
    // npm
    npmignore:    { src: '_.npmignore',       dest: '.npmignore' },
    // Gulpfile, package and lambda.json
    gulpfile:     { src: 'gulpfile.babel.js', dest: 'gulpfile.babel.js' },
    package:      { src: 'package.ejs',       dest: 'package.json', context: getContext },
    lambda:       { src: 'lambda.ejs',        dest: 'lambda.json',  context: getContext },
    // JavaScript Source Code
    index:        { src: 'index.js',          dest: 'index.js' },
    src_handler:  { src: 'src/handler.js',    dest: 'src/handler.js' },
    src_index:    { src: 'src/index.js',      dest: 'src/index.js' },
    test_test:    { src: 'test/test.js',      dest: 'test/test.js' },
    // README
    readme:       { src: 'README.ejs',        dest: 'README.md',   context: getContext },
    // Travis CI and CodeClimate
    travis:       { src: '_.travis.yml',      dest: '.travis.yml' },
    codeclimate:  { src: '_.codeclimate.yml', dest: '.codeclimate.yml' },
  }),

  install: function () {
    this.npmInstall();
  }
});
