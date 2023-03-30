# Logging

## Best Practices

### Use built-in framework logger instead of console
**Start from reading the [official article](https://docs.nestjs.com/techniques/logger)**.

The main benefit of using framework's logger over the pure console is its extensibility.
All the loggers across the app share the same set of settings configured in the root. 
It's easy to manage logging level, formatting, color schema and actually anything.
```typescript
// Bad
console.log('event1');

// Good
this.logger.log('event1');
```

***
### Log all the incoming HTTP requests properly
HTTP requests are the root cause of most processes happening on the backend, so capturing the full list of them is absolutely required.

Besides that, make sure, you log the next information for each of them:
- method
- path
- url
- status code
- response time
- query params
- request body
- path params
- source IP
- any user identifying information

***
### Keep logs structure logical and standardized
`Always keep in mind, information that is easily accessible right in place, may become really hard to extract later 
if you don't add enough metadata to your logs`

#### The minimal structure I propose:

```json
{
	"timestamp": 0, // presented by default
	"level": "string", // presented by default
	"context": "string", // presented by default
	"event": "string", // a short identifiable string describing the exact line of code you log from
	"message": "string", // optional human-readable description
	// ... identifiers for entities the process is related to
	// ... extra values that might be important in examining the event 
}
```

The main goal of writing logs is to trace what happens under the hood, and be able 
to reproduce the complete history of some incident.

It becomes really complex, if you don't follow any conventions when logging events.

Imagine having a long-running process which log lines like this:
```text
{ timestamp: 00000001, level: "info", context: "SomeComplexProcess", processId: 1, status: 0, projectId: 1, message: "Process started" }
{ timestamp: 00000002, level: "info", message: "Process 1 passed the first stage and started the second one" }
{ timestamp: 00000003, level: "info", context: "SomeComplexProcess", processId: 2, status: 0, projectId: 2, message: "Process started" }
{ timestamp: 00000004, level: "error", context: "SomeComplexProcess", processId: 1, status: -1, error: "Something went wrong" }
```
At first sight, when you read these logs and know how the observed process works, 
it's possible and maybe even obvious to understand what happened. 

At the same time, imaging having thousands of such logs, and a task to select only
those related to some specific project id. With the current structure 
**it's almost impossible**.

And now imagine having the same task and the next lines:
```text
{ timestamp: 00000001, context: "SomeComplexProcess", level: "info", processId: 1, status: 0, projectId: 1, event: "ProcessStart" }
{ timestamp: 00000002, context: "SomeComplexProcess", level: "info", processId: 1, status: 0, projectId: 1, event: "Stage2Started", stage2SpecificProp: 1 }
{ timestamp: 00000003, context: "SomeComplexProcess", level: "info", processId: 2, status: 0, projectId: 2, event: "ProcessStart" }
{ timestamp: 00000004, context: "SomeComplexProcess", level: "error", processId: 1, status: -1, projectId: 2, error: "Something went wrong" }
```
*Obviously, now it can be done with a single simple command.*

**So always, when it's possible, extend all the logs of some process with the entities identifiers (if the process has any related)**


***
### Group logs with context
As you might have seen above, Nest's built-in logger has a `context` property written on every log line by default.

The minimal requirement is to always make sure, the context of your log lines correlate with what process they represent.

"Context" might be the **name of the class, long-running process, or method**. Byt general recommendation, is to keep contexts 
abstract enough, so filtering out some specific context give you some meaningful part of the pass your code goes through.

***
### Log different steps of complex processes
For long-running processes it's usually useful to have sight on where exactly it stopped and with what data.

Of course, keep in mind following the same pattern and passing similar identifiable properties through this process

***
### Utilize stdout
The only reliable and mostly guaranteed way to deliver information from the inside 
of the app to the outside, is to output it to the `stdout`. None of logging solutions 
that write data asynchronously to some external place, can't guarantee your logs 
will be delivered in case of unexpected process shutdown.

At the same time, `stdout` being the most basic and common way of outputting 
information from the process, will not only write all of your logs but will 
also text a stack trace in case of an unexpected error.

**So, make sure, the app writes AT LEAST to stdout**

***
### Use independent storage
Make sure, your logs are stored properly, so you can access them independently 
from the main application. Your logging solution should be aware of application 
and server crashes, lack of disk space, connection loss, and so on.
***Most of us remember logs when something goes wrong***

**The best way to store logs is to constantly write them to some external storage.**

The solution we usually prefer for projects started from boilerplate is to 
utilize what `AWS ECS` provides out of the box. Which writes all the 
`stdout` to CloudWatch. The format it expects by default is `JSON`, so what we have 
to do is to make sure our logger provides valid single-line `JSON` to the `stdout`.

***
## Examining logs with CloudWatch
When the app is deployed to `AWS ECS` and set up properly, you should probably 
have all your `stdout` constantly stored at the `CloudWatch` log stream attached 
to your application service.

All the logs the app captures should be queryable here:
```AWS Console Home > CloudWatch > Logs Insights```

To learn how to build queries with their syntax, read **[this article](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)**
***
If you use some query often, think about 
**[saving it for quick access](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html)** 
or even **[adding it to a dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_ExportQueryResults.html)**

Creating a dashboard might be really beneficial (especially when you visualize data)
as it aggregates a lot of information accessible with just one click. So it definitely worth it.
