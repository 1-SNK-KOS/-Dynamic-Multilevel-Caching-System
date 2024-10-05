// __tests__/CacheManager.test.js
const CacheManager = require('../CacheManager');

describe('CacheManager', () => {
    let cacheManager;

    beforeEach(async () => {
        cacheManager = new CacheManager();
        await cacheManager.addCacheLevel(3, 'LRU'); // L1
        await cacheManager.addCacheLevel(2, 'LFU'); // L2
    });

    test('should retrieve data from L1 cache', async () => {
        await cacheManager.put('A', '1');
        expect(await cacheManager.get('A')).toBe('1');
    });

    test('should evict least recently used data from L1', async () => {
        await cacheManager.put('A', '1');
        await cacheManager.put('B', '2');
        await cacheManager.put('C', '3');
        await cacheManager.put('D', '4'); // Evicts 'A'
        expect(await cacheManager.get('A')).toBe(null);
        expect(await cacheManager.get('B')).toBe('2');
    });

    test('should promote data from L2 to L1', async () => {
        await cacheManager.put('A', '1');
        await cacheManager.put('B', '2');
        await cacheManager.put('C', '3');
        await cacheManager.put('D', '4'); // 'B' gets evicted to L2
        expect(await cacheManager.get('B')).toBe('2'); // Retrieves 'B' from L2 and promotes it to L1
    });

    test('should track cache hit and miss rates', async () => {
        await cacheManager.put('A', '1');
        await cacheManager.get('A'); // Hit
        await cacheManager.get('B'); // Miss
        cacheManager.displayStats(); // Should show a hit rate of 50%
    });
});
