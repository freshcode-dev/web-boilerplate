[//]: # (
	Original text is stored on the google disk. 
	Don't put anything here before changing the original file
	https://docs.google.com/document/d/1kUAAgVYSZWZWMq80t-bQU4RxicwmyDwBvk51GIyqibI/edit?usp=sharing
)

[//]: # (
	Converted with https://products.aspose.app/words/conversion/docx-to-md
)

# Event handlers naming conventions
*[Original article](https://javascript.plainenglish.io/handy-naming-conventions-for-event-handler-functions-props-in-react-fc1cbb791364)*

Event handler functions are pretty straightforward on the surface: some event happens, some function handles said event. However, in order to maintain consistency between your React components and keep your code clean, it helps to have some sort of naming convention.

Fortunately, the HTML event attributes have already done half of the work for us! HTML event attributes already provide a very basic naming convention which follows the format of onEvent (camel-cased for readability) where Event is the event. For example, onchange, onclick, and onsubmit are all examples that follow this naming convention. Why change this convention when using React? Let’s just follow it to make our lives easier!

## Naming your functions
Naming your handler functions follows a similar naming convention to the one for event handler attributes. Simply remember that there is a flow being followed here when it comes to the cause and effect. Whereas an event attribute adheres to using the on prefix, we will adjust our handler naming convention so that it proceeds the event by adopting the handle prefix. Thus, the naming convention becomes handleSubjectEvent where Subject is the thing the handler is focused on and Event is the event taking place.

Let’s take a look at some examples for further clarity:
### Convention
- handleEvent
- handleSubjectEvent
### Examples
- handleNameChange
- handleChange
- handleFormReset
- handleReset
## Naming your props
When creating a React component which has a prop that handles something, simply follow the onEvent convention (adding a Subject if applicable).
### Convention
- onEvent
- onSubjectEvent
### Examples
- onNameChange
- onChange
- onFormReset
- onReset
- 
## Tying it all together
```tsx
<SomeComponent 
	onNameChange={handleNameChange} 
	onFormReset={handleFormReset}
/>
```
