# Boilerplate

This project was generated using [Nx](https://nx.dev).

[General purpose nx-related information can be found here.](misc/instructions/about-nx.md)

## Specific instructions
- [Packages management](misc/instructions/packages-management.md)
- [IaaC and AWS CDK overview](misc/instructions/iaac-and-cdk-overview.md) 
- [Infrastructure and deployment](misc/instructions/infrastructure-and-deployment.md)
- [Integrate testing results with gitlab](misc/instructions/integrate-testing-results-with%20gitlab.md)
- [Releasing manually with git tags](misc/instructions/releasing-manually-with-git-tags.md)
- **[Common mistakes](misc/instructions/common-mistakes.md)**

### Backend
- [Backend naming conventions](misc/instructions/backend-naming-conventions.md)
- [Mapping classes with automapper](misc/instructions/mapping-with-automapper.md)
- [Exceptions handling](misc/instructions/exceptions-handling.md)
- [Logging](misc/instructions/logging.md)
- [Working with database layer](misc/instructions/working-with-database-layer.md)

### React
- [React-based projects structure](misc/instructions/react-based-projects-structure.md)
- [React-based projects naming conventions](misc/instructions/react-naming-convention.md)
- [React-based projects routing](misc/instructions/react-based-projects-routing.md)
- [Working with modal windows in react](misc/instructions/react-working-with-modal-windows.md)

Before starting working on the project, it's highly recommended to go through all the articles. 
**If any part seem controversial, feel free to discuss it with the project team-lead**

<hr>

## Automation
The repository has a few automated tasks configured.
They are managed with `husky` and technically are a set of git-hooks, that are placed at `/.husky` and should be installed automatically after the very first packages installation.

**Please, make sure hooks were installed properly. The most common problems are described in the [official FAQ](https://typicode.github.io/husky/#/?id=faq)**

## Branches naming
Branches should always contain a number of a task from the management tool, so it can be identified and 
mapped with the original cause of its creation. The common rule is, the branch should be easily identifiable, 
but at the same time as short as possible.

It can be simple pattern like `PRJ-1`. It's a recommended approach as type of task, and all the additional context 
can be found in task management system and commits messages.

It'a allowed to add an optional description of what is about to be done: `PRJ-1-short-description`. But this approach 
is more suitable for rare cases when task identifier isn't enough

## Commits naming
We have a `commit-lint` package, that verifies each and every package name with a set of rules described in `/commitlint.config.js`.

To pass the validation, your commit message should at least follow these few rules:
- The simplest commit message has to contain task name, and a message: 
```
PRJ-1: test
```
- In most cases, it would be ver helpful, if you include a commit type info as well: 
```
[FIX] PRJ-1: test
```
- Even better, if your commit contains it's scope (which is usually helpful when testing the app): 
```
[FIX] [Dashboard] PRJ-1: test
```
- If you want to add extra details to your commit, it's always allowed and welcomed. Just add an empty line after the commit message, and write the body below:
```
[FIX] [Dashboard] PRJ-1: test

Body message
```

*If for some reason, you want to bypass the message verification, you can run commit message without hooks (`git commit --no-verify`). But in this case, you are the one responsible for it, so should have a strict reasoning behind it.*

## Environment variables
All the applications have their own `.env` files. Values inside are always defaults, so should not be related to any production environment.

All the custom environment variables, your application may use have to be defined inside `.env` file of a corresponding project.

`.env` files are tracked by VCS. If you add any environment variable, please make sure, it's pushed, so all the members are aware of it

`.env.local` is the way to override any variable (e.g. database connection options). It's totally ignored by VCS

[Learn more about .eng files overrides](https://nx.dev/recipes/environment-variables/define-environment-variables)

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

`nx.json/workspace.json` - autogenerated files. You don't need to touch them in most cases

`misc/Dockerfile` - production Dockerfile. Expects us to have the application built to package the output into an image

`misc/full.Dockerfile` - production Dockerfile, that is able to build the app by their own

`misc/env.sh` - script for dockerized frontend, that is supposed to package existing container environment variables into a small js file. Useful when deploying the same application image to different environments

`misc/.gitlab-ci.yml` - build instructions for gitlab

`libs/shared` - library for shared code like classes, DTOs, types, enums, etc. Supports validation decorators, and versatile libraries like lodash

`libs/data` - contains all the backend's "domain" info

`db-migrations` - the app to run if you want to apply the migrations from `data` lib to the database 


## How to manage 3rd party dependencies
**!!! It's important to note, that dependencies management is a little different from what is proposed by default for NX projects**

Unlike default NX structure, all the apps and libs can have their own package.json files, thanks to **[pnpm workspaces](https://pnpm.io/pnpm-workspace_yaml)**

The main benefit here is, we don't need to deal with a long list of dependencies inside of root folder. Root package.json only contain dev dependencies and those, that are used across all the projects (like validation library)

Anyway, some backend libraries don't work as expected with webpack, so things like "@nestjs/common" and a few more libraries have to be on a root level.

For libraries, the recommended way is to place packege.json inside of specific library folder and then duplicate the dependencies list to a project, that is using the library.
The main reason is, during the build process, NX creates us a simplified version of a package.json, containing only packages, that are directly used. But this process is still kinda unpredictable, for dependencies described outside the target project.

**!!! Please, make sure, your dependencies versions are the same, across the whole repository.**
