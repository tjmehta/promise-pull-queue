# promise-pull-queue

A promise queue class for handling pull based async tasks. Pushed results will be pulled in-order and pulled-deferreds will be resolve in-order as results are received.

# Installation

```sh
npm i --save promise-pull-queue
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import PullQueue from 'promise-pull-queue'
// commonjs
const PullQueue = require('promise-pull-queue').default
```

#### Push promised results onto the queue and pull them later

```js
import PullQueue from 'promise-pull-queue'

const queue = PullQueue()
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
import PullQueue from 'promise-pull-queue'

const queue = PullQueue()

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
import PullQueue from 'promise-pull-queue'

const queue = PullQueue()

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

#### Pull deferred results off the queue and wait for future promised results, but cancel some

```js
import PullQueue from 'promise-pull-queue'

const queue = PullQueue()

setTimeout(() => {
  // promised results pushed later
  queue.push(Promise.resolve(100))
  queue.push(Promise.resolve(200))
  queue.push(Promise.resolve(300))
}, 100)

// wait for results, before any are pushed
const controller = new AbortController()
controller.abort()
await Promise.all([
  queue.pull(controller.signal), // [AbortError aborted]
  queue.pull(), // 100
  queue.pull(), // 200
  queue.pull() // 300
]) // [AbortError aborted]
```

# License

MIT
