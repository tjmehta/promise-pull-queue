# deferred-queue

A promise queue class for handling push and pull based async tasks

# Installation

```sh
npm i --save deferred-queue
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import DeferredQueue from 'deferred-queue`
// commonjs
const DeferredQueue = require('deferred-queue').default
```

#### Push promised results onto the queue and pull them later

```js
import DeferredQueue from 'deferred-queue`

const queue = DeferredQueue()
queue.push(Promise.resolve(100))
queue.push(Promise.resolve(200))
queue.push(Promise.resolve(300))

// some time later
await queue.pull() // 100
await queue.pull() // 200
await queue.pull() // 300
```

#### Pull promised results off the queue and wait for future results

```js
import DeferredQueue from 'deferred-queue`

const queue = DeferredQueue()

let resolve1
const p1 = new Promise(resolve => {
  resolve1 = resolve
})
let resolve2
const p2 = new Promise(resolve => {
  resolve2 = resolve
})
let resolve3
const p3 = new Promise(resolve => {
  resolve3 = resolve
})

queue.push(p1)
queue.push(p2)
queue.push(p3)

setTimeout(() => {
  // promises resolved later
  resolve1(100)
  resolve2(200)
  resolve3(300)
}, 100)

// wait for promised results
await Promise.all([
  queue.pull(), // 100
  queue.pull(), // 200
  queue.pull()  // 300
])
```

#### Pull deferred results off the queue and wait for future promised results

```js
import DeferredQueue from 'deferred-queue`

const queue = DeferredQueue()

setTimeout(() => {
  // promised results pushed later
  queue.push(Promise.resolve(100))
  queue.push(Promise.resolve(200))
  queue.push(Promise.resolve(300))
}, 100)

// wait for results, before any are pushed
await Promise.all([
  queue.pull(), // 100
  queue.pull(), // 200
  queue.pull() // 300
])
```

# License

MIT
