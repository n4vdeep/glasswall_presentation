/* 
We first need to understand the core workflow infrastructure we would need to have in place. 
To establish a Continuous Integration pipeline we would need at a minimum the following components in our work flow,

- a source control repository, that allowed for both local and remote source control
- an automated build agent that watched the source repo, and triggered build whenever new code was checked into the repo
- automated testing tools, for build tests and smoke test
- deployment tools for configuration management and automation (Infrastructure as Code, config.yml for example below)
*/

// For this demo I will be using a simple hello world app that spits out a message

// The below code would be pushed to a source control repo -> 
// before getting there it essentially would be intercepted by a test process
// a series of tests would be run on the code by the tests code that was written
// this is to certify the code is error/bug free
// once passed the deployment can commence


// TESTABLE CODE:
const helloWorld = require('../handler').helloWorld;

describe('helloWorld', () => {
  let event = {};
  let context = {};
  let resp = {};

  it('should call helloWorld function with success', (done) => {
    let callback = (ctx, data) => {
      console.log(data);
      resp = data;
      done();
    }
    helloWorld(event, context, callback);
    expect(resp.statusCode).toBe(200);
  });
});

const HelloWorld = require('../lib/hello-world');

describe('sayHello', () => {
  let event = {};
  let hWorld = new HelloWorld();

  it('should call sayHello and return message', () => {
    expect(hWorld.sayHello(event).message).toBe('Successfully executed!');
  });
});


// APP
// would be in a file called helloWorld.js for example
class HelloWorld {
  sayHello(event) {
    return {
      message: 'Successfully executed!',
      input: event,
    };
  }
}

module.exports = HelloWorld;


// would be in a file called handler.js for example
module.exports.helloWorld = (event, context, callback) => {

  var hWorld = new HelloWorld();

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(hWorld.sayHello(event)),
  };

  callback(null, response);
};


// CI/CD WITH CLOUD PROVIDER
/*
Create Access Management user in cloud provider
  Configure CI/CD provider (CircleCI, TravisCI, Jenkins) with Cloud provider (AWS, GCP, Azure)
    add cloud provider credentials to CI/CD project 
*/


// CONFIGURATION WITH YAML
/* 
  - a yaml config file will handle the deployment of the app into the cloud
  - this will pull in the code from the source repo
  - run our tests on it
  - if these pass the app will be deployed on to our cloud
  - if the tests fail there will be error log output in our ci/cd interface to review
*/

// The config.yml file may look similar to this:
jobs:
build:
    ...

steps:
- checkout

      # Download and cache dependencies
  - restore_cache:
keys:
- dependencies - cache - {{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
  - dependencies - cache

  - run:
name: Install Serverless CLI and dependencies
command: |
  sudo npm i - g serverless
npm install

  - run:
name: Run tests with code coverage
command: npm test--coverage

  - run:
name: Deploy application
command: sls deploy

  - save_cache:
paths:
- node_modules
key: dependencies - cache - {{ checksum "package.json" }}

// There is build process with in each job, and there after a few steps. 
// The checkout step will check out the files from the attached source repo which is configured in the working directory. 
// run steps will execute bash commands.
// We'll install the serverless cli and the project dependencies, then run our tests with code coverage enabled, and finally deploy the application.

// This config.yml file snippet is based on using CircleCI as a CI/CD provider.


// IMPLEMENT WORKFLOW
/*
Push code to github or gitlab
  this is picked up in CircleCI
    watch ci/cd UI tests output
    # you can see tests running because of the --coverage run step

  if pass
    build process happens

    when finished
      output a deployment endpoint
        copy into browser to see message from app
        # "Successfully executed!"
*/

