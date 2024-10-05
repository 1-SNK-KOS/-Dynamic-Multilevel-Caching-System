# Dynamic Multilevel Caching System

## Table of Contents
- [Introduction](#introduction)
- [Installation and Setup](#installation-and-setup)
- [How to Run the Program](#how-to-run-the-program)
- [Explanation of the Eviction Policies](#explanation-of-the-eviction-policies)
- [Concurrency](#concurrency)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Performance Optimizations](#performance-optimizations)
- [Unit Testing](#unit-testing)
- [Future Improvements](#future-improvements)
- [Conclusion](#conclusion)

---

## Introduction

This project implements a **Dynamic Multilevel Caching System** in **Node.js**. The system is designed to manage data across multiple cache levels, each with its own size and eviction policy (Least Recently Used - LRU, or Least Frequently Used - LFU). The cache levels are dynamic, allowing the user to add or remove levels during runtime. Furthermore, the system ensures efficient data retrieval by promoting frequently accessed data from lower levels to higher levels, and it is optimized with thread safety using **mutex locks** to support concurrent reads and writes.

This caching system is ideal for scenarios requiring efficient memory management and fast data retrieval across multiple cache hierarchies, like those found in operating systems, distributed systems, and large-scale web applications.

---

## Installation and Setup

### Prerequisites

To run this project, you need to have **Node.js** installed (version 14.x or higher recommended).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/1-SNK-KOS/Dynamic-multilevel-cache

2. **Navigate into the project directory**:
   ```bash
   cd dynamic-multilevel-cache

3. **Install the dependencies**:
   ```bash
   npm install

## How to Run the Program
1. **Run the application**:
   ```bash  
   node index.js

This will execute the caching system, insert sample values, retrieve them, and display the current state of the caches along with performance statistics (cache hit rate).

2. **Run the unit tests**: 
   ```bash   
    npm test

 To validate the system’s correctness and ensure the promotion and eviction policies work properly: 

 ---
 # Explanation of the Eviction Policies
  ## Least Recently Used (LRU)

The **LRU eviction policy** evicts the item that was least recently accessed. In this implementation, when a key-value pair is accessed, it is moved to the end of the queue (represented by the order of keys in the **Map**). When the cache is full, the first key in the **Map** (which is the least recently used) is evicted.

* **Key operations**:
   * On every 
get, the accessed key is removed and re-inserted to ensure it is treated as the most recently used.
  * When the cache is full, the first item (least recently used) is evicted.

## Least Frequently Used (LFU)
The LFU eviction policy evicts the key that has been accessed the fewest times. Each time a key is accessed, its usage count is incremented. The key with the lowest access count is evicted when the cache is full.

 * **Key operations:**
   * On every get, the access frequency of the key is incremented.
   * On put, if the cache is full, the key with the lowest frequency is removed.


# Concurrency

To ensure the cache system can handle concurrent access (multiple reads and writes happening at the same time), we have implemented mutex locks using the async-mutex library. This guarantees thread safety, preventing race conditions when two or more operations try to modify the cache simultaneously.

* **Mutex: A mutex (mutual exclusion)** is a synchronization primitive used to prevent multiple processes from accessing shared data at the same time. In this project, mutexes are used in the get and put methods of each cache level to ensure data consistency.

By using mutex locks, we ensure that:

* Only one thread can read or write to the cache at any given time.
* Data integrity is maintained, and no race conditions occur when the cache is accessed by multiple threads.

# Design Decisions
## 1. Dynamic Cache Levels
* The system supports multiple cache levels (L1, L2, ..., Ln), where L1 is the highest priority. The cache is designed to dynamically allow the addition and removal of cache levels during runtime.
* Each cache level can have a different size and eviction policy (LRU or LFU). This adds flexibility and scalability to the system, making it adaptable to different memory management requirements.
## 2. Promotion of Data
* When data is accessed in a lower cache level (L2, L3, etc.), it is promoted to L1. This ensures that frequently accessed data stays in the highest priority cache (L1) for faster future retrieval.
* When promoting data, it is first removed from the lower cache levels, ensuring that the same data does not exist in multiple levels simultaneously.
## 3. Concurrency Handling
* Implementing mutex locks ensures that the system can handle concurrent read and write operations without causing inconsistencies or race conditions. This feature is critical in multi-threaded environments.
## 4. Performance Metrics
* The system tracks cache hit and cache miss rates, which helps in monitoring the performance of the cache. A higher hit rate indicates more efficient cache management.

# Assumptions
During the design of the CacheManager, a few assumptions were made to ensure smooth operations:

**1.Promotion Assumption:** When data is promoted from a lower cache level (L2, L3, etc.) to a higher one (L1), it is removed from the lower level. This is to avoid redundancy and to prevent the same data from occupying space in multiple cache levels.

 * If a key is found in L2 or lower, it is immediately promoted to L1. This ensures the most frequently accessed data remains in the highest priority cache for faster retrieval.
 * No extra assumptions were made about the eviction order during promotion; the promotion always inserts the data as if it were a new entry in L1.

**2. Fixed Eviction Policy for Each Cache Level:** Once a cache level is assigned an eviction policy (LRU or LFU), it cannot be changed dynamically without removing the cache level and adding it back with the desired policy.

## Performance Optimizations
* **Efficient Data Retrieval:** Data is always retrieved starting from the highest-priority cache (L1). If not found, the system searches through lower cache levels sequentially. This ensures minimal access time for frequently accessed data.
* **Optimized Promotion:** When data is promoted from a lower level to a higher one, it is inserted into the higher cache (L1) based on the eviction policy, and it is removed from the lower level. This optimizes memory usage and ensures that the system maintains the priority order of data.

## Unit Testing
Comprehensive unit tests have been implemented using Jest to validate the following:

* **Correct data retrieval and storage:** Ensures that the put and get operations function as expected.

* **Eviction policies:** Tests whether the LRU and LFU eviction policies are applied correctly when the cache is full.

* **Data promotion:** Verifies that data is properly promoted from lower levels to higher levels.

* **Cache hit and miss rates:** Checks that the system correctly tracks and displays cache performance statistics.

 To run the tests:
    ```bash 
     npm test 




# Conclusion
This **Dynamic Multilevel Caching System** showcases efficient memory management, dynamic cache level handling, and robust eviction policies. It not only meets the assignment requirements but goes beyond by incorporating thread safety, cache performance tracking, and flexible eviction policies. With its scalability and design flexibility, this system is adaptable to various caching use cases, from web servers to distributed systems.

If you have any feedback or suggestions, feel free to contact me!

