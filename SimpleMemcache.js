export default class SimpleMemcache {
	constructor() {
		this.cache = {};
	}
	
	has(key) {
		return this.cache.hasOwnProperty(key);
	}

	get(key) {
		return this.cache[key];
	}

	set(key, value) {
		this.cache[key] = value;
	}
}