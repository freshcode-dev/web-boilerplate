# Global exceptions handling

It's usually impossible to prevent all the errors. Even linters, compilers, and proper quality assurance 
reduce the chance of getting errors but don't guarantee the absence of problems.
Which makes exceptions handling a basic but really important part of any app.

## Backend
Handling exceptions in NodeJS is pretty well documented and discussed topic, so I see no reason describing it once again.

**[To know more about errors and what to do with them, read this article](https://www.toptal.com/nodejs/node-js-error-handling)**

### Handling errors on our backend
In case of application based on this boilerplate, the **minimal requirement** is to have **AT LEAST** unhandled rejections and unhandled exceptions caught.

So, when deploying the app for the first time, developer has to make sure, entrypoint of all the node apps contain the next lines:
- root logger initialization
```typescript
import { Logger } from '@nestjs/common';

const rootLogger: Logger | null = new Logger('ApplicationRoot');

// ...app initialization logic
```
- subscription to errors, that weren't caught somewhere else
```typescript
// ...app initialization logic

process
	.on('unhandledRejection', (reason, promise) => {
		if (rootLogger) {
			rootLogger.error('Unhandled Rejection at Promise', reason);
		} else {
			console.error(reason, 'Unhandled Rejection at Promise', promise);
		}
	}).on('uncaughtException', (reason) => {
		if (rootLogger) {
			rootLogger.error('Uncaught Exception thrown', reason);
		} else {
			console.error('Uncaught Exception thrown', reason);
		}

	process.exit(1);
});

// ...app start
```

## Frontend

### 401/403 API responses
Needs to be described...

### Sockets reconnection
Needs to be described...

### React error boundary
Needs to be described...

### Notifying users about errors
Needs to be described...

### Retrying errored requests
Needs to be described...
