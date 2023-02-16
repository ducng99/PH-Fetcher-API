export default class SimpleMemcache {
    constructor() {
        this.cache = {};
    }

    has(key) {
        if (this.cache[key].expire < Date.now()) {
            delete this.cache[key];
        }

        return this.cache.hasOwnProperty(key);
    }

    get(key) {
        return this.cache[key].value;
    }

    set(key, value, expire = 0) {
        this.cache[key].value = value;
        this.cache[key].expire = expire;
    }
}