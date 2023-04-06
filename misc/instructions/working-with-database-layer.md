# Working with the database layer

## How to organize migration

Think of migration as of a single granular fact of updating the database.

Speaking about when to group changes into a single migration file, and when to keep them separate, try to find a balance between the next two rules:
- If the changes you are making are all related to the same migration purpose, it may be better to group them together in a single migration file. For example, if you are making changes to support a new feature in your application, these changes could all be grouped together in a single migration file.
- Changes should be manageable: It's important to keep each migration file manageable in size so that it's easier to review, test, and deploy. If a migration file becomes too large, it may be more difficult to manage and could increase the risk of errors or issues.

Overall, the goal should be to group related database changes together in a way that makes sense and improves the overall manageability and readability of your database schema.

## How to generate DB migrations
As we deal with webpack, we don't use the built-in TypeORM CLI. [Umzug](https://www.npmjs.com/package/umzug) is used instead

All the migrations should be included into `libs/data/src/migrations/index.ts`.
To make it easier, and not extra boilerplate, you can simply call `pnpm create-migration --name=<NAME>` inside of `libs/data` folder

One of the main benefits of using Umzug is, you can pass almost whatever you want inside the migration.
For more details, discover the `UmzugOptions.context` property

When migration is created and included into the list, it will be executed automatically, on application start. To disable, set `NX_DATABASE_ENABLE_MIGRATIONS` to `false`

## How to deal with enum values
The recommended way of storing enumerable values to the database is `lookup tables`.

Using a lookup table to store enumerated values in a database can offer several benefits, including:
- Readability: Storing enumerated values as integers or strings in the main table can make it difficult to understand what the values represent without additional context. A lookup table, on the other hand, can provide clear and descriptive names for the enumerated values, making it easier to understand the data in the database.
- Flexibility: If the list of enumerated values changes frequently, storing them in a separate lookup table can make it easier to update the values without changing the structure of the main table. This can be particularly important in applications that are updated frequently or have a large number of enumerated values.
- Maintainability: A lookup table can help to ensure that enumerated values are consistent across the application. This can be particularly important in larger applications where multiple developers may be working on different parts of the codebase.

* Even when Postgres supports managing enum types, since version 10, lookup tables still seem a good choice 
***
If the case of our application, any enumerable set of values related to any of database entities should be first described as a TypeScript enum (usually in the `shared` library, so all the parts can be reusing it).

Enum members should have their values constantly set. 
**To keep identifiers typing consistent across the app, you should probably use pregenerated `UUID`**
```typescript
export enum UserRolesEnum {
  Admin = '25e102f4-7ee1-4fca-9071-f16e03da237b',
  User = '12c57649-f88c-4c97-9a75-3e5ffef1b9d6'
}
```
After enum is declared, it's value should be inserted into the database within some migration 

After the enum is created, it should be used to type any occurrences of such values across the app. Including classes describing database entities
```typescript
// Bad
roleId: string;
// Good
roleId: UserRolesEnum;
```
When deleting enum, it of course should be removed from the database as well, performing any related data manipulations required.

*Using enums in your migrations has a downside of not being able to remove the enum value without changing old migrations.
You can avoid it using direct values instead of references to enums, when writing migrations. Or simply replace removable enum values with their string identifiers.
As long as you keep it in mind, it's OK.*

## How to run migrations
Backend application has the environment variable `NX_DATABASE_ENABLE_MIGRATIONS` which is responsible for 
running pending database migrations when application starts.

If for some reason, you need to apply migrations without running the main app, `db-migrations` project can be used.
Set `.env` variables to point to the database you want to modify, and run:
```
nx run db-migrations:execute
```
The purpose of having a separate application is, migrations are technically not limited to only managing 
database, but can consume any nest-compatible providers by adding them to the `MigrationContext` type and 
passing from the `DatabaseMigrationService`.

**It's still not recommended to speculate on passing anything to migrations. But if you have some required 
actions related to the modifiable data, you at least can keep them close enough.**
