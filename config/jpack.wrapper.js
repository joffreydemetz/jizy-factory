(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("JiZy requires a window and a document");
    }

    if (typeof global.JiZy !== "undefined") {
        throw new Error("JiZy is already defined");
    }

    // @CODE

    global.JiZy = new JiZy();

})(typeof window !== "undefined" ? window : this);
