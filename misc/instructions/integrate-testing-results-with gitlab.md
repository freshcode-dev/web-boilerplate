# Testing

## Setting up test environment
Gitlab CI provides an ability to run docker containers with direct access to them

[Feature description](https://docs.gitlab.com/ee/ci/services/)

In our case, it means we can launch external dependencies (postgres, redis, etc.) and use them to fully imitate the real environment when testing.

#### Services configuration
Services can be configured with environment variables, set at `variables` section

```yaml
variables:
  POSTGRES_DB: testing
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_HOST_AUTH_METHOD: trust
  REDIS_PASSWORD: Owc1J4cy3DS0TWn0Afed
```

#### Services usage
To make service available inside a job, they can be set like this

```yaml
test:
  stage: test
  services: # containerized apps you want to use
    - name: bitnami/redis:latest
      alias: redis
    - name: postgres:latest
      alias: postgres
  interruptible: true
  variables:
    NX_DATABASE_HOST: postgres
    NX_TEST_DATABASE_NAME: $POSTGRES_DB
  script:
    - $YARN_INSTALL_COMMAND
...
```

## Running tests with the gitlab-compatible results

In case, we are using NX, it already has a lot of things set up.
For example, it allows us to execute `nx test app` command from out of the box. 
But, the prebuilt configuration has a few problems:
1) it only displays results at the console without outputting them.
2) `gitlab` expects us to provide the results in `junit` compatible format
3) `gitlab` expects a single test results file per job, when `NX` generates results per application (so when there is a few apps and libs, NX outputs the results only for the last of them)

### Make NX output results when testing
`* the proposed workaround may not be the best option, as there might be a way to customize jest behavior with NX->project->test->configuration`

First, `jest` is quite popular, as well as `junit`. 
So there are a few npm packages converting test results to suitable format. 
I prefer [jest-junit](https://www.npmjs.com/package/jest-junit) as the most popular.
To use it alongside jest, simply install it as a dev dependency on the root level.

From out of the box, `NX` generates projects with jest setup, and each project has its own preconfigured but customizable `jest.config` file.

To make jest output results for particular project in `junit` suitable format, add formatter to `jest-config` 

```javascript
module.exports = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
	reporters: [
		["jest-junit", {"outputDirectory": "__reports__", "outputName": "frontend.xml"}]
	]
};

```

After it is set, jest outputs test results per project to `__reports__` folder at the root.

The next step is to combine these results into a one file. 
This step can be done with the [junit-report-merger](https://www.npmjs.com/package/junit-report-merger) package.

The following command does the trick, merging all reports from `__reports__` to a single `merged.xml`
```shell
npx jrm ./__reports__/merged.xml "__reports__/*.xml"
```

### Mage gitlab use test results
TO make gitlab aware of generated test results, it's enough to export them as artifacts under `reports->junit` section

The complete `.gitlab-ci` setup should look like this:
```yaml
test:
  stage: test
  services:
    # services your tests need
    - name: bitnami/redis:latest
      alias: redis
    - name: postgres:latest
      alias: postgres
  interruptible: true
  variables:
    # variables to pass into the testable application
    NX_DATABASE_HOST: postgres
    NX_TEST_DATABASE_NAME: $POSTGRES_DB
  script:
    - $YARN_INSTALL_COMMAND # install packages
    - yarn nx run-many --all --target=test # run tests with output to __reports__ folder
    - yarn run merge-test-reports # merge test results
  artifacts:
    when: always
    paths:
      - __reports__
    reports:
      junit: __reports__/merged.xml # use this file as an output of the whole testing process
  only:
    - main
```