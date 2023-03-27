# Common mistakes

## Sockets disconnection when open a link
The bug happens when you have a socket connection established on your page, and try to open same link at the same tab.
Usually, it would just redirect to another page, and that's just fine. 

However, if the link you click is only supposed to open a browser modal window (like when downloading 
a file or so), your page doesn't get closed (technically, does but just for a moment), but all of your 
socket connections drop.

So, if your goal is to make user's window download some file, or open some other modal window without interrupting 
the main tab, use `_blank` instead of `_self` as a target.

```typescript
// Bad
window.open(fileUrl, '_self');

// Good
window.open(fileUrl, '_blank');
```

[Stackoverflow source](https://stackoverflow.com/q/24009218)
