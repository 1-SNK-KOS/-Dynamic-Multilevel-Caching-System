// CacheManager.js
const Cache = require('./Cache');
const { Mutex } = require('async-mutex');

class CacheManager {
    constructor() {
        this.levels = [];
        this.hits = 0;
        this.misses = 0;
        this.mutex = new Mutex(); // Mutex for concurrency control in cache manager
    }

    // Add a cache level with concurrency
    async addCacheLevel(size, evictionPolicy) {
        return this.mutex.runExclusive(() => {
            const cache = new Cache(size, evictionPolicy);
            this.levels.push(cache);
        });
    }

    // Remove a cache level with concurrency
    async removeCacheLevel(index) {
        return this.mutex.runExclusive(() => {
            if (index >= 0 && index < this.levels.length) {
                this.levels.splice(index, 1);
            }
        });
    }

    // Thread-safe 'get' method with concurrency
    async get(key) {
        return this.mutex.runExclusive(async () => {
            for (let i = 0; i < this.levels.length; i++) {
                const result = await this.levels[i].get(key);
                if (result) {
                    this.hits++;
                    if (i > 0) {
                        await this.promote(key, result); // Promote to higher cache level (L1)
                    }
                    return result;
                }
            }
            this.misses++;
            return null; // Cache miss
        });
    }

    // Thread-safe 'put' method with concurrency
    async put(key, value) {
        return this.mutex.runExclusive(async () => {
            if (this.levels.length > 0) {
                await this.levels[0].put(key, value); // Always insert in L1
            }
        });
    }

    // Promote data from lower to higher levels with concurrency
    async promote(key, value) {
        return this.mutex.runExclusive(async () => {
            // Remove the key from lower levels
            for (let i = 1; i < this.levels.length; i++) {
                this.levels[i].cache.delete(key);
                this.levels[i].usageData.delete(key);
            }
            // Insert into the highest level (L1)
            await this.levels[0].put(key, value);
        });
    }

    displayCache() {
        this.levels.forEach((level, index) => {
            console.log(`Level ${index + 1}: `, [...level.cache.entries()]);
        });
    }

    displayStats() {
        const hitRate = (this.hits / (this.hits + this.misses)) * 100;
        console.log(`Cache Hit Rate: ${hitRate.toFixed(2)}%`);
    }
}

module.exports = CacheManager;
