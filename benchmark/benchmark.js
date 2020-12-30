;(async () => {
  const Benchmark = require('benchmark-util')
  const PullQueue = require('../dist/cjs/index').default
  const PullQueueLegacy = require('promise-pull-queue').default
  global.AbortController = require('abort-controller').default

  let bench = new Benchmark()

  bench
    .add(`legacy`, async () => {
      const pullQueue = new PullQueueLegacy()
      pullQueue.pull()
      pullQueue.pushValue(10)
    })
    .add(`current`, async () => {
      const pullQueue = new PullQueue()
      pullQueue.pull()
      pullQueue.pushValue(10)
    })

  let results = await bench.run({
    onCycle: ({ name, totals, samples, warmup }) => {
      console.log(
        `${name} x ${Math.round(totals.avg)} ops/sec ± ${
          Math.round((totals.stdDev / totals.avg) * 10000) / 100
        }% (${totals.runs} runs sampled)`,
      )
    },
  })

  let fastest = results.sort((a, b) =>
    a.totals.avg > b.totals.avg ? -1 : a.totals.avg < b.totals.avg ? 1 : 0,
  )[0].name

  console.log(`Fastest is: ${fastest}`)
})()
