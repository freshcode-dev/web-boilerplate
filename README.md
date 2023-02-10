# Boilerplate

This project was generated using [Nx](https://nx.dev).

🔎 **Smart, Fast and Extensible Build System**

## Specific instructions
- [Dependencies management](misc/instructions/dependencies-management.md)
- [Integrate testing results with gitlab](misc/instructions/integrate-testing-results-with%20gitlab.md)
- [Releasing manually with git tags](misc/instructions/releasing-manually-with-git-tags.md)

## Environment variables
All the applications have their own `.env` files. Values inside are always defaults, so should not be related to any production environment.

All the custom environment variables, your application may use have to be defined inside `.env` file of a corresponding project.

`.env` files are tracked by VCS. If you add any environment variable, please make sure, it's pushed, so all the members are aware of it

`.env.local` is the way to override any variable (e.g. database connection options). It's totally ignored by VCS

[Learn more about .eng files overrides](https://nx.dev/guides/environment-variables)

## Prerequisites
1. `NodeJS` v.18+ and `PostgreSQL` v.15+ installed
2. An empty database created for the project
3. `pnpm` installed

## Steps to launch the app
1. Clone the repository
2. Install all the dependencies with `pnpm install`
3. For both `frontend` and `backend` folders, create a new local config file named `.env.local`. Feel free to set any config value you need locally
4. Follow the [Development server section](#Development server) instructions


## Files and folders
`apps` - all the runnable application

`libs` - shared code, that can be used across multiple apps

`.eslintrc.json` - root linter rules. Can be redefined on app/library level

`tsconfig.base.json` - base typescript build settings. Can be redefined on app/library level

`nx.json/workspace.json` - autogenerated files. You don't need to touch in in most cases

`misc/Dockerfile` - production Dockerfile. Expects us to have the application built to package the output into an image

`misc/full.Dockerfile` - production Dockerfile, that is able to build the app by their own

`misc/env.sh` - script for dockerized frontend, that is supposed to package existing container environment variables into a small js file. Useful when deploying the same application image to different environments

`misc/.gitlab-ci.yml` - build instructions for gitlab

`libs/shared` - library for shared code like classes, DTOs, types, enums, etc. Supports validation decorators, and versatile libraries like lodash

`libs/data` - contains all the backend's "domain" info

## How to create DB migrations
As we deal with webpack, we don't use the built-in TypeORM CLI. [Umzug](https://www.npmjs.com/package/umzug) is used instead

All the migrations should be included into `libs/data/src/migrations/index.ts`. 
To make it easier, and not extra boilerplate, you can simply call `pnpm create-migration --name=<NAME>` inside of `libs/data` folder

One of the main benefits of using Umzug is, you can pass almost whatever you want inside the migration. 
For more details, discover the `UmzugOptions.context` property

When migration is created and included into the list, it will be executed automatically, on application start. To disable, set `NX_DATABASE_ENABLE_MIGRATIONS` to `false`

## How to manage 3rd party dependencies
**!!! It's important to note, that dependencies management is a little different from what is proposed by default for NX projects**

Unlike default NX structure, all the apps and libs can have their own package.json files, thanks to **[pnpm workspaces](https://pnpm.io/pnpm-workspace_yaml)**

The main benefit here is, we don't need to deal with a long list of dependencies inside of root folder. Root package.json only contain dev dependencies and those, that are used across all the projects (like validation library)

Anyway, some backend libraries don't work as expected with webpack, so things like "@nestjs/common" and a few more libraries have to be on a root level.

For libraries, the recommended way is to place packege.json inside of specific library folder and then duplicate the dependencies list to a project, that is using the library.
The main reason is, during the build process, NX creates us a simplified version of a package.json, containing only packages, that are directly used. But this process is still kinda unpredictable, for dependencies described outside the target project.

**!!! Please, make sure, your dependencies versions are the same, across the whole repository.**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@boilerplate/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
