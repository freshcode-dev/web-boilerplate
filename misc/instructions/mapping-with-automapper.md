# Mapping classes with automapper

## Motivation

Building flexible and maintainable architecture usually means segregation of classes, modules, and layers.
The common goal here is to make classes at least follow the [SRP](https://www.enjoyalgorithms.com/blog/single-responsibility-principle-in-oops) and the whole system at least be built [layered](https://www.baeldung.com/cs/layered-architecture).

*(Both concepts are very basic so following them seem indisputable)*


A layered architecture typically consists of multiple layers, such as the presentation layer, business logic layer, and data access layer. Each layer has a specific responsibility and interacts with the layer above and below it in a well-defined manner.

One common practice in a layered architecture is to use [DTO (Data Transfer Object) objects](https://ru.wikipedia.org/wiki/DTO) to transfer data between layers. A DTO is a simple object that contains data and can be used to transfer data between layers without exposing the underlying data model or domain objects. Using DTOs helps to decouple layers and maintain a clear separation of concerns between them.

In addition, when data needs to be mapped from one domain model to another, it's a good practice to use a mapping framework, to avoid writing boilerplate code. A mapping framework can simplify the process of mapping between domain models and DTOs, reducing the risk of errors and improving maintainability.

Unfortunately, TypeScript nor Nest don't provide suitable mapping solutions, allowing to map entities from one type to another, without coupling them with decorators, and without doing lots of unnecessary verbose manual mapping actions. 

At the same time, mature strong-typed languages already have such solutions for a long time. For example, in C# world, [AutoMapper](https://www.nuget.org/packages/automapper/) is used really widely being one of the standard mapping libraries.

Some time ago, community created a npm package strongly inspired by the original AutoMapper, which follows tha same patterns and concepts.
[It's author described his motivation in this article](https://nartc.netlify.app/blogs/automapper-typescript/)

**The package itself is well described on [their website](https://automapperts.netlify.app/)**

#### The main benefits I see in it are:
1. We declare mapping [outside the original models](https://automapperts.netlify.app/docs/tutorial/create-mapping). Which means, our models become fully decoupled and don't need to know anything about the overall context of the app. We can even have a few different mapping rules for different applications which use the same models
1. With an [out-of-the-box plugin](https://automapperts.netlify.app/docs/misc/transformer-plugin), the library doesn't require us write any extra decorators for the models we use
1. With [built-in auto-mapping mapping behavior](https://automapperts.netlify.app/docs/fundamentals/naming-convention), we don't need to describe any obvious mappings (e.g. to map complex model to its simple subset)
1. Mapping rules can be easily grouped and reused with [mapping profiles](https://automapperts.netlify.app/docs/tutorial/mapping-profile)

## Where to place mapping logic?

In an n-layered architecture, it's best to place AutoMapper calls in the service layer. The service layer acts as a bridge between the presentation layer and the data access layer and contains the business logic of the application.

The purpose of the service layer is to encapsulate the business logic and provide a well-defined interface for the presentation layer to interact with. The service layer should be responsible for mapping between the domain objects and DTOs, which is where AutoMapper comes in.

When a request is made from the presentation layer, it should be routed to the appropriate service method in the service layer. The service method will perform the necessary business logic and return the result in the form of a DTO. (Before returning the data to the presentation layer, the service method should use AutoMapper to map the DTO from the domain object, if necessary)

## Where to define mapping rules

When defining mapping rules, always separate them from any other business logic. 

To achieve this, mapping `profiles` can be used. [Read the official documentation to know more](https://automapperts.netlify.app/docs/tutorial/mapping-profile)

Profiles should be defined in their own `injectable` classes within the service layer. When services layer is modular, consider placing each profile close enough to modules it should be mostly used in.

[Official documentation of how to define profiles within the Nest JS application](https://automapperts.netlify.app/docs/nestjs#automapperprofile)

By placing AutoMapper rules in the profiles, we can ensure that the mapping logic is encapsulated within the service layer and not spread across multiple layers. This makes it easier to maintain and modify the mapping logic.

## Initializing automapper on the app
As we use transform plugin to avoid unnecessary decorators, automapper needs a plugin to assign proper annotations to classes and properties for us.

The process of configuring is described on the [official website](https://automapperts.netlify.app/docs/misc/transformer-plugin#nestjs-with-nx), so just adding a code snippet for NX:
```json
{
  "targets": {
    "build": {
      "options": {
        "tsPlugins": [
          {
            "name": "@automapper/classes/transformer-plugin"
          }
        ]
      }
    }
  }
}
```

_Please note that concepts automapper is built around are more applicable to the backend than react frontend. SO I don't provide a react webpack configuration example here._

**_Feel free to extend this document if have a suitable example._**

## Troubleshooting
### Module not resolved
We use `@automapper/classes/transformer-plugin` to avoid defining lots of `@AutoMap` decorators.

However, plugin adds some limitations to using of circular dependencies. If you have some, make sure, modules are registered using correct order. And the modules resolution mode is set to `esnext`.

Otherwise, it may cause the next error:
```text
ERROR in ../../libs/data/src/models/user.entity.ts 18:40-141
Module not found: Error: Can't resolve '../H:\FreshCode_projects\boilerplate-v2\libs\data\src\models\session.entity' in 'H:\FreshCode_projects\boilerplate-v2\libs\data\src\models'
```
