# Backend Naming Convention

## Introduction:
Maintaining a consistent and clear naming convention in your codebase is essential 
for fostering collaboration and ensuring readability. 

By adhering to this naming convention, your codebase becomes more
self-explanatory, making it easier for other developers to understand the expected
behavior of these methods.

## Rules
### Having pairs of `find` and `get` methods where possible
To achieve clarity and consistency in your TypeScript code, consider adopting the 
following naming convention for pairs of find and get methods:

1. **Find Methods:** These methods locate and retrieve data, but they may return 
`null` if the data is not found. Name them with a prefix like `find...`
followed by a noun or phrase describing what you're searching for. 
For example: `findUserByUsername`, `findProductById` or `findRecordByCriteria`.

2. **Get Methods:** These methods retrieve data and should never return `null`. 
Name them with a prefix like `get...` followed by the same noun or phrase used 
for the corresponding find method. For example: `getUserByUsername`, `getProductById`, 
or `getRecordByCriteria`

#### Example:
Let's consider a simple example using a user management system. We'll create 
a pair of find and get methods for retrieving user information by username:

```typescript
class UserManager {
    // Find method - may return null if the user is not found
    findUserByUsername(username: string): User | null {
        // Implementation to search for the user by username
        // If the user is not found, return null
        return null; // Replace with the actual implementation
    }

    // Get method - should never return null
    getUserByUsername(username: string): User {
        const user = this.findUserByUsername(username);
        if (!user) {
            throw new Error(`User with username ${username} not found.`);
        }
        return user;
    }
}
```

In this example, we have a `findUserByUsername` method that locates a user by their
username, which may return null if the user doesn't exist. The corresponding 
`getUserByUsername` method ensures the presence of a user with the specified 
username. If the user is not found, it throws an error.

### Verification Methods
When your methods are intended to check conditions and raise errors if those 
conditions are not met, consider naming them with a prefix like `verify...`. 
This naming convention will clearly indicate the purpose of these methods and 
make your code more self-explanatory. Examples of verification methods might 
include `verifyUserPermission`, `verifyInputParameters`, or `verifyFileExistence`.

#### Example:
```typescript
class UserManager {
    // Verification method - checks user permissions and throws an error if not permitted
    verifyUserPermission(user: User, action: string) {
        if (!userHasPermission(user, action)) {
            throw new Error(`User does not have permission to ${action}.`);
        }
    }
}
```

In this updated TypeScript example, we've introduced a `verifyUserPermission` method. 
This method checks whether a user has the required permission to perform a specific
action. If the user lacks the necessary permission, it throws an error, providing 
a clear indication of the issue.

By consistently using the `verify...` prefix for such verification methods, you 
make your TypeScript codebase more comprehensible and facilitate error detection 
and handling.
