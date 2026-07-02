export default class User {
    constructor() {
        this.interval = null;
        this.caller = null;
        this.logged = false;
        this.initialised = false;
        this.suspend = false;
        this.dontReload = false;
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
        this.initialised = false;
        this.check();
        return this;
    }

    check() {
        if (true === this.suspend) {
            if (this.tOut) {
                clearTimeout(this.tOut);
            }
            return;
        }

        this.tOut = setTimeout(() => this.doCheck(), this.interval);
    }

    doCheck() {
        this.caller();
    }

    reload() {
        if (true === this.dontReload) {
            return this;
        }
        clearTimeout(this.tOut);
        window.location.reload();
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

    isLogged() {
        this.logged = true;
        return this;
    }

    updateUser(uid) {
        if (uid) {
            // logged in through another tab ??
            if (false === this.logged) {
                this.reload();
                return;
            }

            this.logged = true;
        }

        this.initialised = true;
        this.check();
    }
};
