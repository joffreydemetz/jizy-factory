# jizy-factory

The `JiZy` browser namespace: a façade that wires the small `jizy-*` utilities into a single
`Factory` instance — data bag, web storage, logger, translator, messenger, URL builder and HTTP
client — reachable as properties and convenience methods.

## Install

```bash
npm i jizy-factory
```

| Entry | What |
|---|---|
| `lib/index.js` | ESM entry, default export the `Factory` class |
| `dist/js/jizy-factory.min.js` | Browser bundle. It creates **one instance** with the default options and sets it as the global `window.JiZy`; configure it with the setters below. It refuses to start when `window.JiZy` already exists, so load it before anything that adds to `JiZy`. |

### Dependencies

`Factory` itself imports `jizy-api`, `jizy-data`, `jizy-logger`, `jizy-messenger`,
`jizy-storage`, `jizy-translate`, `jizy-url` and `jizy-utils`; those are bundled into the dist.

`package.json` also declares `jizy-browser`, `jizy-cooky`, `jizy-dom`, `jizy-modalizer`,
`jizy-niceselect`, `jizy-obfuscator`, `jizy-reveal`, `jizy-template` and `jizy-tooltip`, so the whole
family installs with the factory. Nothing in the factory imports them: each one is its own browser
bundle with its own global, and a page loads the ones it uses next to `jizy-factory` (for example
through the `modules` list of [`jizy-builder`](https://www.npmjs.com/package/jizy-builder)).

## Quick start

Browser bundle:

```js
JiZy.withDebug(true)
    .setBaseUrlPath('/myapp/')
    .setDefaultLanguage('en')
    .addI18nStore('en', { HELLO_WORLD: 'Hello, World!' });

JiZy.run();                          // starts the messenger once the DOM is ready

JiZy.messenger('Welcome!', 'success');
JiZy.json(JiZy.makeUrl('api/data'), (response) => console.dir(response));
```

ESM:

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

app.run();
app.post('/api/save', { id: 1 }, (response) => { });

const hello = app.translate('hello_world');
const url = app.makeUrl('users/list', { page: 2 });   // '/myapp/users/list?page=2'
```

## Constructor options

| Option | Default | Description |
|---|---|---|
| `debug` | `false` | enables logger output |
| `debugLevel` | `0` | logger verbosity |
| `basePath` | `''` | prefix used by `makeUrl()` |
| `messengerSelector` | `'[data-jizy-messaging]'` | selector of the messages container |
| `language` | `'fr'` | default language for i18n |
| `languageStore` | `{}` | initial translation map, `{ code: { KEY: 'text' } }` |

## What lives on the instance

Properties:
- `data` — generic data bag (`jizy-data`)
- `session`, `local`, `cookie` — storage adapters (`jizy-storage`)
- `log` — logger (`jizy-logger`)
- `i18n` — translator (`jizy-translate`)
- `Messaging` — messenger (`jizy-messenger`)
- `debug`, `basePath`

Lifecycle:
- `run()` — starts the messenger (`Messaging.ready()`) now if the DOM is parsed, else on `DOMContentLoaded`. Call it before the first `messenger()`.
- `use(plugin, opts)` — see below.

Config helpers (chainable):
- `withDebug(debug, level)`
- `setBaseUrlPath(basePath)`
- `setMessagingSelector(selector)`
- `setDefaultLanguage(language)`
- `addI18nStore(language, data)`

Messaging:
- `messenger(msg, type, cfg)` — `type` defaults to `'message'`; `cfg` takes the jizy-messenger options (`persistant`, `timeout`, …)
- `emptyMessages()`

i18n:
- `translate(key, def)` — `def` defaults to the key
- `trans(key, params)` — replaces each `%key%` placeholder; `params` is `[{ key, value }, …]`
- `transPlural(key, num, …sprintfArgs)` — picks `KEY_0`, `KEY_1` or `KEY_MORE` from `num`, then `sprintf`s it with `num` and the other arguments
- `transSprintf(key, …sprintfArgs)`

A translation lookup needs the active language to have a store (`addI18nStore()`, or `JiZy.i18n.init(code, data)`); on an empty translator it throws.

HTTP (a `jizy-api` `jFetch` wired to the messenger: the response's `error` / `message` / `info` strings are displayed):
- `fetch(url, cfg)` — `cfg` takes the jizy-api `sets()` keys (`method`, `json`, `data`, `callback`, `timeout`, …)
- `ajax(url, cfg, callback, messengerConfig)`
- `json(url, callback, cfg)` — `GET` JSON; `cfg.userData` is turned into a query string
- `post(url, data, callback, cfg)` — `POST` JSON

URL:
- `makeUrl(path, vars)` — `basePath` + `path` + query string from `vars` (arrays become `key[]=…`). A third argument is accepted and ignored.

Events:
- `event(name, { bubbles = true, cancelable = true, detail = {} })` — builds a `CustomEvent` to dispatch.
- `pressedEnter(e)`, `pressedEscape(e)` — keyboard checks. Known issue in 4.2.5: they call `KeyPress.on()` on the jizy-utils class rather than on an instance, and throw a `TypeError`; use `new KeyPress().Enter(e)` from `jizy-utils` meanwhile.

## Extending via `use(plugin, opts)`

`use()` accepts any object with a `register(factory, opts)` method and forwards the options through:

```js
const myPlugin = {
    name: 'my-plugin',
    register(factory, opts = {}) {
        factory.something = /* … */;
    }
};

JiZy.use(myPlugin, { /* opts */ });
```

`use()` returns the factory, so calls chain.

## Optional modules (`lib/js/plugins/`)

The package also ships a few optional modules. They are not part of the package entry nor of the
dist bundle, and they are not `use()` plugins: import or concatenate the ones you need.

| File | What |
|---|---|
| `user.js` | ES module, default export `User`: polls a callback (`setCaller(fn)`, `setInterval(ms)`, `init()`) to check the session; `updateUser(uid)` reloads the page when a login happened in another tab; `stopChecking()` / `restartChecking()`. |
| `tokenizer.js` | ES module, default export `Tokenizer`: the same polling shape for a form token; `updateToken(token)` writes it into every `input[name='t']`. Known issue in 4.2.5: `check()` calls itself instead of scheduling `doCheck()`, so `init()` overflows the stack. |
| `tracker.js` | ES module, default export `jTracker`: named tracking callbacks (`add(name, fn)`, `setTrackers({...})`); `track(eventName, data)` calls each one. |
| `dropzone.js` | Raw script: sets `JiZy.DropzoneConfig`, French-language defaults for the jizy-dom `userDropzone` plugin, and turns off `Dropzone.autoDiscover`. |
| `templateCallbacks.js` | Raw script, legacy: relies on `JiZy.Template.addResponseCallbacks` and `JiZy.Unobfuscate`, which the factory does not define. |

The `confirm` dialog moved to jizy-modalizer (`Modalizer.confirm`) in 4.2.3.

## Build

Built with [`jizy-packer`](https://jizy.joffreydemetz.com/packer):

- `npm run jpack:dist` — produces `dist/js/jizy-factory.min.js` (dist/ is committed)
- `npm run jpack:dist-debug` — same, with verbose build logging

The package has no test suite.

## License

MIT — Joffrey Demetz.
