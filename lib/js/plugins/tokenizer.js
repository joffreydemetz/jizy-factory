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
            return this;
        }

        // schedule the next check (it used to call itself: a stack overflow)
        this.tOut = setTimeout(() => this.doCheck(), this.interval);
        return this;
    }

    doCheck() {
        this.caller();
    }

    reset() {
        if (this.tOut) clearTimeout(this.tOut);
        this.suspend = false;
        this.doCheck();
        return this;
    }

    stopChecking() {
        this.suspend = true;
        if (this.tOut) {
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