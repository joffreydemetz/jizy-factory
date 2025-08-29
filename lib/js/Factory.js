import { KeyPress, Intervals, MediaQueries, Tracker } from 'jizy-utils';
import { jFetch } from 'jizy-api';
import jData from 'jizy-data';
import jStorage from 'jizy-storage';
import jTranslate from 'jizy-translate';
import jMessenger from 'jizy-messenger';
import jUrl from 'jizy-url';

import Tokenizer from './js/plugins/tokenizer.js';
import User from './js/plugins/user.js';

export default class Factory {
    constructor() {
        this.debug = false;
        this.basePath = '/';
        this.log = new jLogger(false, 0);

        this.data = new jData();
        this.session = new jStorage('session');
        this.local = new jStorage('local');
        this.cookie = new jStorage('cookie');
        this.interval = new Intervals();

        this.Tracker = new Tracker();
        this.Tokenizer = new Tokenizer();
        this.User = new User();
    }

    init(
        debug = false,
        basePath = '/',
        defaultLanguage = 'fr',
        mQbreakpoints = { xs: 480, sm: 768, md: 992, lg: 1200 },
        messageBoxSelector = '[data-jizy-messaging]'
    ) {
        this.withDebug(debug);
        this.setBaseUrlPath(basePath);
        this.setMessaging(messageBoxSelector);
        this.setI18n(defaultLanguage);
        this.MediaQ = new MediaQueries(mQbreakpoints);

        this.ready(() => {
            this.Messaging.ready();
        });

        return this;
    }

    withDebug(debug = false, level = 0) {
        this.debug = debug;
        this.log.setActive(debug);
        this.log.setLevel(level);
    }

    setBaseUrlPath(basePath) {
        this.basePath = basePath ? basePath.replace('/[\/]+$/g', '') + '/' : '/';
        return this;
    }

    //
    // Messaging
    //
    setMessaging(messageBoxSelector) {
        this.Messaging = new jMessenger(messageBoxSelector);
        return this;
    }
    messenger(msg, type, cfg) {
        this.Messaging.add(msg, type || 'message', cfg || {});
    }
    emptyMessages() {
        this.Messaging.empty();
    }

    // 
    // Fetch
    // 

    fetch(url, cfg) {
        if ('' === url) {
            this.log.error('No URL specified for fetch');
            return;
        }

        const api = new jFetch()
            .init(url, cfg)
            .setMessenger(this.Messaging);

        if (messengerConfig) {
            api.setMessengerConfig(messengerConfig);
        }

        if (callback) {
            api.setCallback(callback);
        }

        api.call();
    }
    ajax(url, cfg, callback, messengerConfig) {
        cfg.callback = callback;
        cfg.messengerConfig = cfg.messengerConfig || {};
        messengerConfig = messengerConfig || {};
        cfg.messengerConfig = { ...cfg.messengerConfig, ...messengerConfig };
        return this.fetch(url, cfg);

        /*if ('' === url) {
            this.log.error('No ajax URL specified');
            return;
        }
    
        const api = new jAjax()
            .init(url, cfg)
            .setMessenger(JiZy.Messaging);
    
        if (messengerConfig) {
            api.setMessengerConfig(messengerConfig);
        }
    
        if (callback) {
            api.setCallback(callback);
        }
    
        api.call();*/
    }
    json(url, callback, cfg) {
        cfg = cfg || {};
        cfg.json = true;
        cfg.method = 'GET';
        cfg.callback = callback;

        if (typeof cfg.userData !== 'undefined') {
            cfg.data = this.toQueryString(cfg.userData);
            delete cfg.userData;
        }

        this.fetch(url, cfg);
    }
    post(url, data, callback, cfg) {
        cfg.json = true;
        cfg.method = 'POST';
        cfg.callback = callback;
        cfg.data = data;

        this.fetch(url, cfg);
    }

    // 
    // i18n
    // 

    setI18n(defaultLanguage = 'fr') {
        this.i18n = new jTranslate(null, defaultLanguage);
        return this;
    }
    translate(key, def) {
        return this.i18n.getTranslation(key, def || key);
    }
    trans(key, params) {
        let str = this.i18n.getTranslation(key);
        for (let i = 0, n = params.length; i < n; i++) {
            str = this.preg_replace(str, '%' + params[i].key + '%', params[i].value);
        }
        return str;
    }
    transPlural(key, num) {
        let originalKey = key;

        switch (num) {
            case 0:
                key += '_0';
                break;
            case 1:
                key += '_1';
                break;
            default:
                key += '_MORE';
                break;
        }

        arguments[0] = this.i18n.getTranslation(key, originalKey);
        return sprintf.apply(null, arguments);
    }
    transSprintf() {
        arguments[0] = this.i18n.getTranslation(arguments[0]);
        return sprintf.apply(null, arguments);
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
                document.addEventListener("DOMContentLoaded", fn);
            }
        }
    }
    resize(fn) {
        if (typeof fn === 'function') {
            window.addEventListener("resize", fn);
        }
    }
    scroll(fn) {
        if (typeof fn === 'function') {
            window.addEventListener("scroll", fn);
        }
    }

    //
    //
    //

    makeUrl(path, vars, notJson) {
        const url = new jUrl(this.basePath);
        return url.make(path, vars, notJson);
    }

    // @DEPRECATED or TOBE REMOVED
    qsa(selector, parent) {
        parent = parent || document;

        if (selector instanceof DOM) {
            return selector;
        }

        if (parent instanceof DOM) {
            return parent.find(selector);
        }

        return Selector(selector, parent);
    }
    pressedEnter(e) {
        return KeyPress.on(e, 'Enter');
    }
    pressedEscape(e) {
        return KeyPress.on(e, 'Escape');
    }
    event(name, props) {
        const options = {
            bubbles: true,
            cancelable: true,
            detail: {}
        };

        if ('bubbles' in props) {
            options.bubbles = props.bubbles
        }
        if ('cancelable' in props) {
            options.cancelable = props.cancelable
        }
        if ('detail' in props) {
            options.detail = props.detail
        }

        return new CustomEvent(name, options);
    }
    proxy(fn, context) {
        if (typeof fn !== "function") {
            throw new TypeError("expected function");
        }
        const args = slice.call(arguments, 2);
        return fn.apply(context || this, args.concat(slice.call(arguments)));
    }
    lazy() {
        if (typeof lozad !== 'undefined') {
            document.querySelectorAll("img[data-src]").forEach(img => img.classList.add("lozad"));
            lozad().observe();
        }
    }
}