import createDeferred, { DeferredPromise } from 'p-defer'
import raceAbort, { AbortError } from 'race-abort'

import PLazy from 'p-lazy'
import TimeOrderedSet from 'time-oset'

export { AbortError } from 'race-abort'

type Task<T> = (signal: AbortSignal) => Promise<T>
type PullQueueItem<T> = {
  deferred: DeferredPromise<T>
  signal: AbortSignal
}

export default class DeferredQueue<T> {
  private pushQueue = new TimeOrderedSet<Task<T>>()
  private pullQueue = new TimeOrderedSet<PullQueueItem<T>>()

  get pushQueueSize() {
    return this.pushQueue.size
  }

  get pullQueueSize() {
    return this.pullQueue.size
  }

  pushValue = (val: T) => {
    return this.pushPromise(
      new PLazy<T>((resolve) => resolve(val)),
    )
  }
  pushError = (err: any) => {
    return this.pushPromise(
      new PLazy<T>((resolve, reject) => reject(err)),
    )
  }
  pushPromise = (promise: Promise<T>) => {
    return this.push((signal) => raceAbort(signal, promise))
  }
  push = (task: Task<T>) => {
    let item
    if (this.pullQueue.size) {
      // queue has deferreds waiting for results, resolve the earliest
      do {
        item = this.pullQueue.shift()
      } while (item?.signal.aborted)
    }
    if (item) {
      const { deferred, signal } = item
      raceAbort(signal, task).then(deferred.resolve, deferred.reject)

      return deferred.promise
    } else {
      // queue does not have any deferreds waiting for results
      // push the async task to be pulled later
      const deferred = createDeferred<T>()
      this.pushQueue.push((signal) => {
        raceAbort(signal, task).then(deferred.resolve, deferred.reject)
        return deferred.promise
      })
      // prevent unhandled exceptions incase this promise is not handled
      deferred.promise.catch(() => {})

      return deferred.promise
    }
  }
  pull = (signal?: AbortSignal): Promise<T> => {
    const _signal = signal ?? new AbortController().signal
    if (this.pushQueue.size) {
      // queue has results, pull earliest
      const task = this.pushQueue.shift() as Task<T>
      return raceAbort(_signal, task)
    }
    // queue does not have any pushed results
    if (_signal.aborted) {
      return Promise.reject(new AbortError())
    }
    // create a deferred to wait for the next result
    const deferred = createDeferred<T>()
    const pullItem = {
      deferred,
      signal: _signal,
    }
    this.pullQueue.push(pullItem)
    return raceAbort(pullItem.signal, deferred.promise).finally(() => {
      this.pullQueue.delete(pullItem)
    })
  }
}
