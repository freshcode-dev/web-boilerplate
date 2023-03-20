# Mapping classes with automapper

## Motivation

Building flexible and maintainable architecture usually means segregation of classes, modules, and layers.
The common goal here is to make classes at least follow the [SRP](https://www.enjoyalgorithms.com/blog/single-responsibility-principle-in-oops) and the whole system at least be built [layered](https://www.baeldung.com/cs/layered-architecture).

*(Both concepts are very basic so following them seem indisputable)*

Building a segregated system always comes along with the concept of [DTO](https://ru.wikipedia.org/wiki/DTO) (transport classes that contain no logic but only data to transfer).

Unfortunately, TypeScript nor Nest don't provide suitable mapping solutions, allowing to map entities from one type to another, without coupling them with decorators, and without doing lots of unnecessary verbose manual mapping actions. 

At the same time, mature strong-types languages already have such solutions for a long time. For example, in C# world, [AutoMapper](https://www.nuget.org/packages/automapper/) is used really widely being one of the standard mapping libraries.

Some time ago, community created a npm package strongly inspired by the original AutoMapper, which follows tha same patterns and concepts.
[It's author described his motivation in this article](https://nartc.netlify.app/blogs/automapper-typescript/)

**The package itself is well described on [their website](https://automapperts.netlify.app/)**

#### The main benefits I see in it are:
1. We declare mapping [outside the original models](https://automapperts.netlify.app/docs/tutorial/create-mapping). Which means, our models become fully decoupled and don't need to know anything about the overall context of the app. We can even have a few different mapping rules for different applications which use the same models
1. With an [out-of-the-box plugin](https://automapperts.netlify.app/docs/misc/transformer-plugin), the library doesn't require us write any extra decorators for the models we use
1. With [built-in auto-mapping mapping behavior](https://automapperts.netlify.app/docs/fundamentals/naming-convention), we don't need to describe any obvious mappings (e.g. to map complex model to its simple subset)
1. Mapping rules can be easily grouped and reused with [mapping profiles](https://automapperts.netlify.app/docs/tutorial/mapping-profile)

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
