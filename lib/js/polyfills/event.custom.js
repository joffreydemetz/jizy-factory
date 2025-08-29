// patch CustomEvent to allow constructor creation (IE/Chrome)
if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    window.CustomEvent.prototype = window.Event.prototype;
}
