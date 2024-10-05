// Cache.js
const { Mutex } = require('async-mutex');

class Cache {
    constructor(size, evictionPolicy) {
        this.size = size;
        this.evictionPolicy = evictionPolicy;
        this.cache = new Map(); // Store key-value pairs
        this.usageData = new Map(); // Track access frequency or order
        this.mutex = new Mutex(); // Mutex lock for thread safety
    }

    // Thread-safe 'get' method
    async get(key) {
        return this.mutex.runExclusive(() => {
            if (!this.cache.has(key)) return null;
            this.updateUsageData(key); // Update access for eviction
            return this.cache.get(key); // Return the actual value
        });
    }

    // Thread-safe 'put' method
    async put(key, value) {
        return this.mutex.runExclusive(() => {
            if (this.cache.size >= this.size) {
                this.evict(); // Evict if cache is full
            }
            this.cache.set(key, value); // Store the value properly
            this.updateUsageData(key);
        });
    }

    // Evict based on the eviction policy
    evict() {
        let evictionKey;
        if (this.evictionPolicy === 'LRU') {
            evictionKey = [...this.cache.keys()][0]; // Least recently used (oldest key)
        } else if (this.evictionPolicy === 'LFU') {
            evictionKey = [...this.usageData.entries()]
                .sort((a, b) => a[1] - b[1])[0][0]; // Least frequently used
        }
        this.cache.delete(evictionKey);
        this.usageData.delete(evictionKey);
    }

    // Update usage for eviction policies (LRU or LFU)
    updateUsageData(key) {
        if (this.evictionPolicy === 'LRU') {
            // Update the order for LRU by removing and reinserting the key
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
        } else if (this.evictionPolicy === 'LFU') {
            // Increment the usage count for LFU
            this.usageData.set(key, (this.usageData.get(key) || 0) + 1);
        }
    }
}

module.exports = Cache;
