import { createClient } from 'redis';

export default class SimpleMemcache {
    constructor() {
        this.client = createClient();
    }

    async init() {
        await this.client.connect();
    }

    async has(key) {
        if (await this.client.exists(key)) {
            const object = JSON.parse(await this.client.get(key));

            if (object.expire < Date.now()) {
                await this.client.del(key);
                return false;
            }
            
            return true;
        }

        return false;
    }

    async get(key) {
        if (await this.client.exists(key)) {
            const object = JSON.parse(await this.client.get(key));
            return object.value;
        }

        return null;
    }

    async set(key, value, expire = 0) {
        this.client.set(key, JSON.stringify({ value, expire }));
    }
}