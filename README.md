# lambda6 Yeoman Generator
[![Build Status](https://travis-ci.org/nombers/lambda6.svg)](https://travis-ci.org/nombers/generator-lambda6)

Easily create [lambda6](https://github.com/nombers/lambda6) microservices using this generator for [Yeoman](https://github.com/yeoman/yeoman). If you aren't familiar with Yeoman, it's a scaffolding tool that helps developers eliminate the boilerplate tasks of setting up a new Node.js project. Check it out!

## Quick Start
```bash
npm install -g generator-lambda6
mkdir my-lambda6-service && cd $_
yo lambda6
```

This will start the Yeoman wizard, which will prompt you about the options you want to enable. Once that's done, the dependencies will be installed and your project should be ready to build:
```bash
gulp
```

Consult the generated `README.md` file for more details.

## What's Included
* babel: compiles `src` directory into `dist` for uploading
* mocha and chai for unit testing
* gulp for easy building
* .travis.yml that's ready to use
* other configuration files: .gitignore, .npmignore, etc.

## Prerequisites
### Node.js and npm
If you're reading this, you most likely have these installed already, you savvy developer, you! Otherwise, go ahead and install the latest version of Node.js (npm is included) using whatever method works for your OS.
### Yeoman
You'll need Yeoman installed, which requires Node.js and npm (above):
```bash
npm install -g yo
```
### AWS Lambda
Be sure to read the  [AWS Lambda Developer Guide](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html), specifically the sections on authoring Node.js Lambda functions. This is essential to understanding what this generator does. This generator will create a project that builds a `lambda.zip` bundle containing your Node.js code so that it can be deployed on AWS Lambda. It will also create build steps in the `gulpfile.babel.js` file to automatically upload and provision the Lambda function to AWS. You'll need an AWS account and appropriate access privileges to do this, of course.
### lambda6
First of all, be sure to familiarize yourself with [lambda6](https://github.com/nombers/lambda6) as well as so you understand the programming model that the generated handler function implements. By invoking an AWS Lambda function with an `operation` and `payload`, the function can essentially operate as a microservice. This is a key design principle so that functions are neither too bloated for what they do nor too overloaded (spanning too many concerns).
