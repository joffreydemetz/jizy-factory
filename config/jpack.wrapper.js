/*! jFactory v@VERSION | @DATE | [@BUNDLE] */
(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("jFactory requires a window and a document");
    }

    if (typeof global.jFactory !== "undefined") {
        throw new Error("jFactory is already defined");
    }

    // @CODE 

    global.jFactory = jFactory;

})(typeof window !== "undefined" ? window : this);