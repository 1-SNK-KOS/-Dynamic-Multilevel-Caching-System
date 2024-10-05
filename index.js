// index.js
const CacheManager = require('./CacheManager');

async function main() {
    const cacheManager = new CacheManager();

    // Add two cache levels: L1 (LRU) and L2 (LFU)
    await cacheManager.addCacheLevel(3, 'LRU'); // L1
    await cacheManager.addCacheLevel(2, 'LFU'); // L2

    // Insert some values
    await cacheManager.put('A', '1');
    await cacheManager.put('B', '2');
    await cacheManager.put('C', '3');
    
    // Retrieve values
    console.log(await cacheManager.get('A')); // Output: '1'
    console.log(await cacheManager.get('B')); // Output: '2'
    
    // Insert more values, causing eviction in L1
    await cacheManager.put('D', '4'); // L1 is full, evicts LRU item ('A')
    
    // Cache status
    cacheManager.displayCache();

    // Retrieve stats
    cacheManager.displayStats();
}

main();
