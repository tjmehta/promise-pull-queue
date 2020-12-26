import DeferredQueue from '../index'
import createDeferred from 'p-defer'

describe('DeferredQueue', () => {
  it('should queue pushed values', async () => {
    const queue = new DeferredQueue()
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
    const queue = new DeferredQueue()
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
    const queue = new DeferredQueue()
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
    const queue = new DeferredQueue()
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
    const queue = new DeferredQueue()
    queue.push(Promise.resolve(10))
    queue.push(Promise.resolve(20))
    queue.push(Promise.resolve(30))

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from resolved promises pushed later', async () => {
    const queue = new DeferredQueue()
    setTimeout(() => {
      queue.push(Promise.resolve(10))
      queue.push(Promise.resolve(20))
      queue.push(Promise.resolve(30))
    }, 10)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from pushed rejected promises', async () => {
    const queue = new DeferredQueue()
    queue.push(Promise.reject(new Error('1'))).catch(() => {})
    queue.push(Promise.reject(new Error('2')))
    queue.push(Promise.reject(new Error('3')))

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from rejected promises pushed later', async () => {
    const queue = new DeferredQueue()
    setTimeout(() => {
      queue.push(Promise.reject(new Error('1')))
      queue.push(Promise.reject(new Error('2')))
      queue.push(Promise.reject(new Error('3')))
    }, 10)

    await Promise.all([
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 1]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 2]`),
      expect(queue.pull()).rejects.toMatchInlineSnapshot(`[Error: 3]`),
    ])
  })

  it('should pull values in order from pushed promises that resolve later', async () => {
    const queue = new DeferredQueue()
    const d1 = createDeferred()
    queue.push(d1.promise)
    const d2 = createDeferred()
    queue.push(d2.promise)
    const d3 = createDeferred()
    queue.push(d3.promise)
    setTimeout(() => {
      d3.resolve(30)
      d2.resolve(20)
      d1.resolve(10)
    }, 10)

    await Promise.all([
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`10`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`20`),
      expect(queue.pull()).resolves.toMatchInlineSnapshot(`30`),
    ])
  })

  it('should pull values in order from pushed promises that reject later', async () => {
    const queue = new DeferredQueue()
    const d1 = createDeferred()
    queue.push(d1.promise)
    const d2 = createDeferred()
    queue.push(d2.promise)
    const d3 = createDeferred()
    queue.push(d3.promise)
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
