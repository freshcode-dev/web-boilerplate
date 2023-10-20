## React-based projects routing

When building frontend with React, make sure you fully utilize the `react-router` capabilities.

Overall, a proper react routing setup should be modular, efficient, and easy to maintain. By following these best practices, you can create a routing setup that provides a seamless user experience and improves the performance of your app.

### Routing root
The complete routing tree is defined in the root component of the app using 
[createBrowserRouter](https://reactrouter.com/en/main/routers/create-browser-router) 
function. This function takes an array of nested routes definitions, making them an 
actual pages hierarchy of the app.

Consider reading the official documentation to have a better understanding. 

### Routes definition
Define your routes as objects of type `RouteObject`. Such objects should include 
a path and an element property. The path property specifies the URL that should 
match the route, while the element property defines the component that should 
render when the route is accessed.

Nested routes definitions can be passed to the `children` property.

**[Documentation](https://reactrouter.com/en/main/route/route#type-declaration)**

### Modularity
According to the article ["React-based projects structure"](./react-based-projects-structure.md), 
the application should be organized as a set of mostly independent modules.

Speaking of routing for such modules, it's strongly recommended for each module 
to have it's own routes tree (when it's possible and reasonable).

If module provides any routes, they should be defined in the root of the module, 
in file `[module name].router.tsx`. Module's `index` file should then export 
the "router" object. 

For example, simple `auth.router.tsx` can look like this:
```tsx
export const AuthModuleRouter: RouteObject[] = [
  { path: '/auth/login', element: <LoginPage />, handle: { title: 'nav.sign-in' } },
  { path: '/auth/sign-up', element: <SignUpPage />, handle: { title: 'nav.sign-up' } },
];
```
Which then can be included into the global routing definition like this:
```tsx
const routes = createBrowserRouter([
  // ...
  {
    element: (
      <RequireUnauthorized>
        <RootSuspense>
          <UnauthorizedArea />
        </RootSuspense>
      </RequireUnauthorized>
    ),
    children: AuthModuleRouter
  },
  // ...
]);
```

### Use lazy loading
Use lazy loading to improve performance by only loading the components that are 
needed. Use the `React.lazy()` function to load each component lazily, and wrap 
each element with a Suspense component to handle the loading state.

```typescript jsx
const StylesExamplesPage = lazy(async () => lazyRetry(async () => import('./pages/styles-examples/styles-examples.page')));

export const StyledExamplesRouter: RouteObject[] = [
    // ...
    { path: 'page', element: <StylesExamplesPage /> },
    // ...
];
```

**[Documentation](https://reactrouter.com/en/main/route/lazy)**

### Utilize as much standard API as possible
1. Use dynamic routing to handle dynamic URLs. You can use parameters in your path property to define dynamic segments of your URL. Use the useParams hook to access the values of these parameters in your component.
1. Use the `useNavigate` hook to programmatically navigate between routes. The useNavigate hook allows you to navigate to a new URL using JavaScript code instead of a link.
1. Use the `Link` component to create links that navigate to different routes within your app. The Link component creates a clickable link that will update the URL and render the appropriate component.
1. Use the `useLocation` hook to access information about the current URL. The useLocation hook allows you to access information about the current URL, including the pathname, search parameters, and hash.
1. Use the `useParams` hook to access dynamic route parameters. The useParams hook allows you to access the values of dynamic parameters defined in your path property.
1. Use the `useMatch` hook to access information about the current match. The useMatch hook allows you to access information about the current match, including the params object, path, and url.
1. Use the `Outlet` component to dynamically render nested routes without refreshing the page completely

**[Documentation](https://reactrouter.com/en/main/start/overview)**

### Always use guards at the highest level possible
Use routes protection to restrict users from accessing specific routes they don't have permissions for. 
Guard components are components that wrap other components with an extra logic that usually verifies user meets needed conditions and redirects if not.

```typescript jsx
// declare wrapper component with any logic you need...
export const RequireAuth = ({ children, isSignedIn }): ReactElement => {
  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
// and then wrap any route with it
const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <RootSuspense>
          <AuthorizedArea />
        </RootSuspense>
      </RequireAuth>
    ),
    children: [
      { path: 'demo', element: <AuthorizedPage />, handle: { title: 'nav.demo' } }
    ]
  }
]);
```
It's important to group routes based on the security requirements you apply to them, so you can apply guards at the highest point possible. 

### Use area-components
When your routes are properly grouped into modules, or when UI-system designed to have lots of similarities 
between different pages, it might be worthy to introduce multiple levels of nesting.

To organize them properly, make sure you utilize the `Outlet` component mentioned above.
```typescript jsx
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthorizedArea: FC = () => 
<div>
	<h1>Header shared across all the nested routes</h1>
	<Outlet />
</div>;
```

