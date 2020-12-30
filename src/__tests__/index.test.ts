import PullQueue from '../index'
import createDeferred from 'p-defer'

describe('PullQueue', () => {
  it('should queue pushed values', async () => {
    const queue = new PullQueue()
    queue.pushValue(10)
    queue.pushValue(20)
    queue.pushValue(30)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from pushed values later', async () => {
    const queue = new PullQueue()
    setTimeout(() => {
      queue.pushValue(10)
      queue.pushValue(20)
      queue.pushValue(30)
    }, 10)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should queue pushed errors', async () => {
    const queue = new PullQueue()
    queue.pushError(new Error('1'))
    queue.pushError(new Error('2'))
    queue.pushError(new Error('3'))

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from pushed errors later', async () => {
    const queue = new PullQueue()
    setTimeout(() => {
      queue.pushError(new Error('1'))
      queue.pushError(new Error('2'))
      queue.pushError(new Error('3'))
    }, 10)

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from pushed resolved promises', async () => {
    const queue = new PullQueue()
    queue.pushPromise(Promise.resolve(10))
    queue.pushPromise(Promise.resolve(20))
    queue.pushPromise(Promise.resolve(30))

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from resolved promises pushed later', async () => {
    const queue = new PullQueue()
    setTimeout(() => {
      queue.pushPromise(Promise.resolve(10))
      queue.pushPromise(Promise.resolve(20))
      queue.pushPromise(Promise.resolve(30))
    }, 10)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from resolved promises pushed later, and cancel some', async () => {
    const queue = new PullQueue()
    setTimeout(() => {
      expect(queue.pushQueueSize).toMatchInlineSnapshot(`0`)
      expect(queue.pullQueueSize).toMatchInlineSnapshot(`3`)
      queue.pushPromise(Promise.resolve(10))
      queue.pushPromise(Promise.resolve(20))
      queue.pushPromise(Promise.resolve(30))
      expect(queue.pushQueueSize).toMatchInlineSnapshot(`0`)
      expect(queue.pullQueueSize).toMatchInlineSnapshot(`0`)
    }, 10)

    const controller = new AbortController()
    controller.abort()
    await Promise.all([
      expect(queue.pull(controller.signal)).rejects.toMatchInlineSnapshot(
        `[AbortError: aborted]`,
      ),
      expect(queue.pull(controller.signal)).rejects.toMatchInlineSnapshot(
        `[AbortError: aborted]`,
      ),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
    expect(queue.pushQueueSize).toMatchInlineSnapshot(`0`)
    expect(queue.pullQueueSize).toMatchInlineSnapshot(`0`)
  })

  it('should pull values in order from pushed rejected promises', async () => {
    const queue = new PullQueue()
    queue.pushPromise(Promise.reject(new Error('1'))).catch(() => {})
    queue.pushPromise(Promise.reject(new Error('2')))
    queue.pushPromise(Promise.reject(new Error('3')))

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from rejected promises pushed later', async () => {
    const queue = new PullQueue()
    setTimeout(() => {
      queue.pushPromise(Promise.reject(new Error('1')))
      queue.pushPromise(Promise.reject(new Error('2')))
      queue.pushPromise(Promise.reject(new Error('3')))
    }, 10)

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from pushed promises that resolve later', async () => {
    const queue = new PullQueue()
    const d1 = createDeferred()
    queue.pushPromise(d1.promise)
    const d2 = createDeferred()
    queue.pushPromise(d2.promise)
    const d3 = createDeferred()
    queue.pushPromise(d3.promise)
    expect(queue.pushQueueSize).toMatchInlineSnapshot(`3`)
    expect(queue.pullQueueSize).toMatchInlineSnapshot(`0`)
    setTimeout(() => {
      d3.resolve(30)
      d2.resolve(20)
      d1.resolve(10)
      expect(queue.pushQueueSize).toMatchInlineSnapshot(`0`)
      expect(queue.pullQueueSize).toMatchInlineSnapshot(`0`)
    }, 10)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from pushed promises that reject later', async () => {
    const queue = new PullQueue()
    const d1 = createDeferred()
    queue.pushPromise(d1.promise)
    const d2 = createDeferred()
    queue.pushPromise(d2.promise)
    const d3 = createDeferred()
    queue.pushPromise(d3.promise)
    setTimeout(() => {
      d3.reject(new Error('3'))
      d2.reject(new Error('2'))
      d1.reject(new Error('1'))
    }, 10)

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })
})
