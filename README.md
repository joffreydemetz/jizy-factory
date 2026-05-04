# jizy-factory

High-level façade that wires the small `jizy-*` modules into a single `Factory` instance, ready to drop into a browser app.

A new `Factory()` instantiates and exposes: a generic data bag, web storage (session/local/cookie), a logger, an i18n translator, a messenger, a URL builder, and an HTTP client — all reachable as properties and convenience methods on the factory.

## Install

```bash
npm i jizy-factory
```

The package exports a default `Factory` class. The browser build attaches a global `JiZy`.

Runtime dependencies (declared in `package.json`):
`jizy-api`, `jizy-data`, `jizy-logger`, `jizy-messenger`, `jizy-storage`, `jizy-translate`, `jizy-url`, `jizy-utils`.

## Quick start

```js
import Factory from 'jizy-factory';

const app = new Factory({
    debug: true,
    debugLevel: 0,
    basePath: '/myapp/',
    messengerSelector: '[data-jizy-messaging]',
    language: 'en',
    languageStore: { en: { hello_world: 'Hello, World!' } },
});

app.messenger('Welcome!', 'success');

app.json('/api/data', (response) => {
    console.dir(response);
});

app.post('/api/save', { id: 1 }, (response) => { });

const hello = app.translate('hello_world');

const url = app.makeUrl('users/list', { page: 2 });
```

## Constructor options

| Option | Default | Description |
|---|---|---|
| `debug` | `false` | enables logger output |
| `debugLevel` | `0` | logger verbosity |
| `basePath` | `''` | prefix used by `makeUrl()` |
| `messengerSelector` | `'[data-jizy-messaging]'` | DOM selector where the messenger renders |
| `language` | `'fr'` | active language for i18n |
| `languageStore` | `{}` | initial translation map |

## What lives on the instance

Properties:
- `app.data` — generic data bag (`jizy-data`)
- `app.session`, `app.local`, `app.cookie` — storage adapters (`jizy-storage`)
- `app.log` — logger (`jizy-logger`)
- `app.i18n` — translator (`jizy-translate`)
- `app.Messaging` — messenger (`jizy-messenger`)
- `app.debug`, `app.basePath`

Config helpers (chainable):
- `withDebug(debug, level)`
- `setBaseUrlPath(basePath)`
- `setMessagingSelector(selector)`
- `setDefaultLanguage(language)`
- `addI18nStore(language, data)`

Messaging:
- `messenger(msg, type, cfg)` — `type` defaults to `'message'`
- `emptyMessages()`

i18n:
- `translate(key, def)`
- `trans(key, params)` — `params` is `[{ key, value }, …]`
- `transPlural(key, num, …sprintfArgs)`
- `transSprintf(key, …sprintfArgs)`

HTTP (via `jizy-api`):
- `fetch(url, cfg)`
- `ajax(url, cfg, callback, messengerConfig)`
- `json(url, callback, cfg)` — `GET` JSON
- `post(url, data, callback, cfg)` — `POST` JSON

URL:
- `makeUrl(path, vars, notJson)`

## Extending via `use(plugin, opts)`

`use()` accepts any object with a `register(factory, opts)` method and forwards the options through:

```js
const myPlugin = {
    name: 'my-plugin',
    register(factory, opts = {}) {
        factory.something = /* … */;
    }
};

app.use(myPlugin, { /* opts */ });
```

`use()` returns the factory, so calls chain. The package itself ships no built-in plugins — anything beyond what the constructor wires up comes from your own plugin or from extending the class.

## Build

Built with [`jizy-packer`](https://github.com/joffreydemetz/jizy-packer):

- `npm run jpack:dist` — produces `dist/js/jizy-factory.min.js` (browser global `JiZy`)

## License

MIT — Joffrey Demetz.
