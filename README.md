# Jizy Factory

The Jizy Factory library provides a unified interface for common frontend tasks, including messaging, AJAX, i18n, user/session management, and more. 
I designed to simplify and standardize my web application development.
It's easily extensible.

## Features
- Messaging and notifications
- AJAX/fetch helpers
- Internationalization (i18n)
- User/session/local storage management
- DOM event helpers (ready, resize, scroll)
- Plugin support (tokenizer, user state, etc.)
- .. Look into each JiZy module for more features

## Example Usage

```js
import Factory from './lib/js/Factory.js';

const app = new Factory();
app.init(true, '/myapp/', 'en');

// Show a message
app.messenger('Welcome!', 'success');

// Fetch JSON data
app.json('/api/data', (response) => {
  console.dir('Data:', response);
});

// Translate a key
app.i18n.addTranslations('en', {
  'hello_world': 'Hello, World!'
});
const hello = app.translate('hello_world');

// Listen for DOM ready
app.ready(() => {
  console.log('DOM is ready!');
});
```
