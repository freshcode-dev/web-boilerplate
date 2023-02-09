# Dependencies management

By default, nx proposes to keep all the dependencies at the root-level `package.json` file (even when some sort of atomicity is available through [publishable libraries](https://nx.dev/more-concepts/buildable-and-publishable-libraries#publishable-libraries) functionality).

In most cases, this approach is fine. Though, I find it a bit problematic in cases, when we have a few microservices with similar set of peer dependencies, and we want to update them separately.

## Package manager
We use pnpm as a package manager, because of a numerous [articles](https://www.atatus.com/blog/npm-vs-yarn-vs-pnpm/) describing it's effectiveness when it comes to dealing with a large amount of packages and projects.

It might not be a silver bullet for all the use-cases, but here a few benefits:
- Speeds up the process of installing packages, reusing everything it ever installed earlier
- Able to reuse the same package for multiple apps/projects
- Isolates the visibility scope for peer dependencies making them inaccessible from our codebase

## Where to declare dependencies
What we propose is to follow more lerna-like approach. It's as simple as following a few rules:
- If package can be useful for most parts of the app, place it **at the root level**
- If package is something NX uses for any of it's processes, keep it **at the root level**
- If package is used in some app, and you know, other parts should not use it, place it **in the application's package.json** *(e.g. `react` package when you have only one frontend)*
- If package is used in some library, but not all the apps should be able to use it, keep the package **at the library level**

## Troubleshooting
### Some of our dependencies can't find it's peer dependency
When installing dependencies at the project level, some of them may not be optimized for such use-cases. As the result, when starting the app containing such package, it may show you an error similar to this:
```
ERROR in ./node_modules/.pnpm/@nestjs+mapped-types@1.2.2_gzoa7mq33oxaftnwvdaaoxgjv4/node_modules/@nestjs/mapped-types/dist/type-helpers.utils.js 68:27-63
Module not found: Error: Can't resolve 'class-transformer/storage' in 'H:\FreshCode_projects\boilerplate-v2\node_modules\.pnpm\@nestjs+mapped-types@1.2.2_gzoa7mq33oxaftnwvdaaoxgjv4\node_modules\@nestjs\mapped-types\dist'

ERROR in ./node_modules/.pnpm/@nestjs+serve-static@3.0.1_2upcdgwmlxb2ueb6j52bq7smg4/node_modules/@nestjs/serve-static/dist/loaders/fastify.loader.js 19:113-139
Module not found: Error: Can't resolve '@fastify/static' in 'H:\FreshCode_projects\boilerplate-v2\node_modules\.pnpm\@nestjs+serve-static@3.0.1_2upcdgwmlxb2ueb6j52bq7smg4\node_modules\@nestjs\serve-static\dist\loaders'
```
Usually it happens because of PNPM's peer dependencies isolation, when peer dependencies stored at the root level are inaccessible to project-level packages.

The best way we see to fix it is to allow the original package hoisting to the top, by extending the `/.npmrc` file with the next line:
```
public-hoist-pattern[]=your_package_throwing_errors
```
### Package is accessible when serving the app locally, but isn't when deploying the app
When building and deploying apps, we usually set them a [`targets->build->options->generatePackageJson`](https://nx.dev/packages/webpack/executors/webpack#generatepackagejson) flag. 
Which means, **NX** will try to generate a new `package.json` file during the build process, containing all the dependencies, tha app uses.
At the same time, original `package.json` files are used when serving apps locally.

So, as an example, if some package isn't used directly, or installed at the root level, or used through one of our libraries, **NX** may not include it in the generated `package.json`.

To fix such behavior, you can declare such a package directly at the app-level `package.json`. In this case, it's the developer's responsibility to install the same package's version and keep it up to date.
