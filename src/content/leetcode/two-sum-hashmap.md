---
title: Two Sum - Hash Map
date: 2026-08-06
problemNumber: 1
problemUrl: https://leetcode.com/problems/two-sum/
difficulty: easy
tags: [array, hashmap]
timeComplexity: O(n)
spaceComplexity: O(n)
draft: true
---

Use a hash map of value to index while scanning once.

## Idea

For each number `x`, compute `target - x` and check whether it exists in the map.

## Python

```python
def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
```
