import { Types, Functions } from 'jizy-utils';
import jData from 'jizy-data';
import jStorage from 'jizy-storage';
import jLogger from 'jizy-logger';
import jTranslate from 'jizy-translate';
import jMessenger from 'jizy-messenger';
import jUrl from 'jizy-url';
import { jFetch } from 'jizy-api';

const defaultMessengerSelector = '[data-jizy-messaging]';
const defaultLanguage = 'fr';

class Factory {
    constructor({
        debug = false,
        debugLevel = 0,
        basePath = '',
        messengerSelector = defaultMessengerSelector,
        languageStore = {},
        language = defaultLanguage,
    } = {}) {
        this.debug = debug;
        this.basePath = basePath;

        this.data = new jData();

        this.session = new jStorage('session');
        this.local = new jStorage('local');
        this.cookie = new jStorage('cookie');

        this.log = new jLogger(debug, debugLevel);

        this.i18n = new jTranslate(languageStore, language);
        this.Messaging = new jMessenger(messengerSelector);
    }

    run() {
        this.ready(() => {
            this.Messaging.ready();
        });
    }

    use(plugin, opts = {}) {
        if (plugin && typeof plugin.register === 'function') {
            plugin.register(this, opts);
        }
        return this;
    }

    // 
    // CONFIG
    // 

    withDebug(debug = false, level = 0) {
        this.debug = debug;
        this.log.setActive(debug);
        this.log.setLevel(level);
        return this;
    }
    setMessagingSelector(selector) {
        this.Messaging.setSelector(selector);
        return this;
    }

    //
    // MESSENGER
    // 

    messenger(msg, type, cfg) {
        this.Messaging.add(msg, type || 'message', cfg || {});
    }
    emptyMessages() {
        this.Messaging.empty();
    }

    // 
    // I18N
    // 

    setDefaultLanguage(language) {
        this.i18n.setDefaultLanguage(language);
        return this;
    }
    addI18nStore(language, data) {
        this.i18n.addStore(language, data);
        return this;
    }
    translate(key, def) {
        return this.i18n.getTranslation(key, def || key);
    }
    trans(key, params) {
        let str = this.i18n.getTranslation(key);
        for (let i = 0, n = params.length; i < n; i++) {
            str = Functions.preg_replace(str, '%' + params[i].key + '%', params[i].value);
        }
        return str;
    }
    transPlural(key, num) {
        const originalKey = key;

        switch (num) {
            case 0: key += '_0'; break;
            case 1: key += '_1'; break;
            default: key += '_MORE'; break;
        }

        arguments[0] = this.i18n.getTranslation(key, originalKey);
        return Functions.sprintf.apply(null, arguments);
    }
    transSprintf() {
        arguments[0] = this.i18n.getTranslation(arguments[0]);
        return Functions.sprintf.apply(null, arguments);
    }

    // 
    // FETCH
    // 

    fetch(url, cfg) {
        if ('' === url) {
            this.log.error('No URL specified for fetch');
            return;
        }
        const api = new jFetch();
        api.init(url, cfg);
        api.setMessenger(this.Messaging);
        api.call();
    }
    ajax(url, cfg = {}, callback = null, messengerConfig = {}) {
        if (callback) cfg.callback = callback;
        cfg.messengerConfig = { ...(cfg.messengerConfig || {}), ...messengerConfig };
        return this.fetch(url, cfg);
    }
    json(url, callback = null, cfg = {}) {
        cfg.json = true;
        cfg.method = 'GET';
        if (callback) cfg.callback = callback;
        if (typeof cfg.userData !== 'undefined') {
            cfg.data = Functions.toQueryString(cfg.userData);
            delete cfg.userData;
        }
        this.fetch(url, cfg);
    }
    post(url, data = null, callback = null, cfg = {}) {
        cfg.json = true;
        cfg.method = 'POST';
        if (callback) cfg.callback = callback;
        if (data) cfg.data = data;
        this.fetch(url, cfg);
    }

    // 
    // URL 
    // 

    setBaseUrlPath(basePath) {
        this.basePath = basePath ? basePath.replace(/[\/]+$/g, '') + '/' : '/';
        return this;
    }
    makeUrl(path, vars, notJson) {
        const url = new jUrl(this.basePath);
        return url.make(path, vars, notJson);
    }

    //
    // DOM
    //

    ready(fn) {
        if (typeof fn === 'function') {
            if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                fn();
            }
            else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        }
    }
}

export default Factory;
