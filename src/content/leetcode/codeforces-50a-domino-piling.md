---
title: Domino piling
date: 2026-08-25
problemNumber: 50
problemUrl: https://codeforces.com/problemset/problem/50/A
difficulty: easy
tags: [greedy, math]
timeComplexity: O(1)
spaceComplexity: O(1)
draft: false
---

Divide the area of the board by the area of a domino.

## Idea

The area of the board is $M \times N$ and the area of a domino is $2 \times 1 = 2$. 

## Code

```c++
#include <iostream>

using namespace std;

int main() {
    int M, N;
    cin >> M >> N;

    int area = M * N;
    int dominoArea = 2 * 1;

    cout << area / dominoArea << endl;

    return 0;
}

```
