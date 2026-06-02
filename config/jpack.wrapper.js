(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("JiZy requires a window and a document");
    }

    if (typeof global.JiZy !== "undefined") {
        throw new Error("JiZy is already defined");
    }

    // @CODE

    // Expose a ready INSTANCE (not the class) — the à-la-carte client bundle and
    // all consumers (templates, dom-plugins, site JS) use `window.JiZy` as an
    // instance (JiZy.i18n.init, JiZy.data.set, …). Construction-time config
    // defaults are fine; sites configure post-load (setBaseUrlPath, i18n.init).
    global.JiZy = new JiZy();

})(typeof window !== "undefined" ? window : this);
