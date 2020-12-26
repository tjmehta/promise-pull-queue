import createDeferred, { DeferredPromise } from 'p-defer'

import PLazy from 'p-lazy'
import TimeOrderedSet from 'time-oset'

export default class DeferredQueue<T> {
  private pushSet = new TimeOrderedSet<Promise<T>>()
  private pullSet = new TimeOrderedSet<DeferredPromise<T>>()

  pushValue = (val: T) => {
    this.push(
      new PLazy<T>((resolve) => resolve(val)),
    )
  }
  pushError = (err: any) => {
    this.push(
      new PLazy<T>((resolve, reject) => reject(err)),
    )
  }
  push = (promise: Promise<T>) => {
    // prevent unhandled rejections if promise revolves early
    promise.catch(() => {})

    if (this.pullSet.size) {
      // queue has deferreds waiting for results, resolve the earliest
      const deferred = this.pullSet.shift() as DeferredPromise<T>
      promise.then(
        (val) => deferred.resolve(val),
        (err) => deferred.reject(err),
      )

      return deferred.promise
    } else {
      // queue does not have any deferreds waiting for results
      // create a promised to to be pulled later
      promise.catch(() => {})
      this.pushSet.push(promise)

      return promise
    }
  }
  pull = (): Promise<T> => {
    if (this.pushSet.size) {
      // queue has results, pull earliest
      return this.pushSet.shift() as Promise<T>
    }

    // queue does not have any results,
    // create a deferred to wait for the next result
    const deferred = createDeferred<T>()
    this.pullSet.push(deferred)

    return deferred.promise
  }
}
