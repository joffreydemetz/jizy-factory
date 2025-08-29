export default class Tokenizer {
    constructor() {
        this.interval = null;
        this.caller = null;
        this.suspend = false;
        this.tOut = null;
    }

    setInterval(interval) {
        this.interval = interval;
        return this;
    }

    setCaller(caller) {
        this.caller = caller;
        return this;
    }

    init() {
        this.check();
        return this;
    }

    check() {
        if (true === this.suspend) {
            if (this.tOut) {
                clearTimeout(this.tOut);
            }
        }
        else {
            this.check();
        }
        return this;
    }

    doCheck() {
        this.caller();
    }

    reset() {
        if (true === this.tOut) clearTimeout(this.tOut);
        this.suspend = false;
        this.doCheck();
        return this;
    }

    stopChecking() {
        this.suspend = true;
        if (true === this.tOut) {
            clearTimeout(this.tOut);
        }
        return this;
    }

    restartChecking() {
        this.suspend = false;
        this.doCheck();
        return this;
    }

    updateToken(token) {
        if (token) {
            document.querySelectorAll("input[name='t']").forEach((el) => { el.value = token; });
        }
        this.check();
    }
};