import DoublyLinkedList, { DoublyNode } from 'doubly'
import createDeferred, { DeferredPromise } from 'p-defer'
import raceAbort, { AbortError } from 'race-abort'

import PLazy from 'p-lazy'

export { AbortError } from 'race-abort'

type Task<T> = (signal: AbortSignal) => Promise<T>
type PullQueueItem<T> = {
  deferred: DeferredPromise<T>
  signal: AbortSignal
}

export default class PromisePullQueue<T> {
  private pushQueue = new DoublyLinkedList<Task<T>>()
  private pullQueue = new DoublyLinkedList<PullQueueItem<T>>()

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
    const _signal = signal ?? new NoopAbortSignal()

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
    const node = this.pullQueue.tail as DoublyNode<PullQueueItem<T>>

    return raceAbort(pullItem.signal, deferred.promise).finally(() =>
      this.pullQueue.deleteNode(node),
    )
  }
}

class NoopAbortSignal implements AbortSignal {
  readonly aborted: boolean = false
  // not implemented..
  readonly reason: AbortError | undefined
  // @ts-ignore: not implemented..
  throwIfAborted: () => void
  onabort: ((this: AbortSignal, ev: Event) => any) | null = null
  addEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {}
  removeEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void {}
  dispatchEvent(event: Event): boolean {
    return false
  }
}
