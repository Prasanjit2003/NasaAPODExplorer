package com.jit.apod.util;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class SimpleLRUCache<K, V> {

    private final int capacity;
    private final long ttlMillis;
    private final Map<K, CacheObject<V>> cache;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public SimpleLRUCache(int capacity, long ttlMillis) {
        this.capacity = capacity;
        this.ttlMillis = ttlMillis;
        
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, CacheObject<V>> eldest) {
                return size() > SimpleLRUCache.this.capacity;
            }
        };
    }

    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            cache.put(key, new CacheObject<>(value, System.currentTimeMillis()));
        } finally {
            lock.writeLock().unlock();
        }
    }

    public V get(K key) {
        lock.readLock().lock();
        try {
            CacheObject<V> wrapper = cache.get(key);
            if (wrapper == null) return null;

            if (System.currentTimeMillis() - wrapper.timestamp > ttlMillis) {
                return null; 
            }
            return wrapper.data;
        } finally {
            lock.readLock().unlock();
        }
    }

    // Wrapper class to hold data and creation time
    private static class CacheObject<T> {
        final T data;
        final long timestamp;

        CacheObject(T data, long timestamp) {
            this.data = data;
            this.timestamp = timestamp;
        }
    }
}
