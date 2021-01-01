export class DoublyLinkedList<T> {
  size = 0
  head: DoublyNode<T> | undefined
  tail: DoublyNode<T> | undefined

  forEach(
    cb: (value: T, index: number, list: DoublyLinkedList<T>) => unknown,
  ): void {
    let index = 0
    let cursor = this.head
    while (cursor) {
      cb(cursor.value, index, this)
      cursor = cursor.next
      index++
    }
  }

  push(value: T): DoublyNode<T> {
    if (this.tail == null) {
      this.tail = this.head = new DoublyNode<T>(value)
    } else {
      const inserted = new DoublyNode<T>(value)
      inserted.prev = this.tail
      this.tail.next = inserted
      this.tail = inserted
    }
    this.size += 1

    return this.tail
  }

  shift(): T | undefined {
    if (this.head == null) return

    const removed = this.head
    this.deleteNode(removed)

    return removed.value
  }

  deleteNode(node: DoublyNode<T>) {
    let onlyNode = this.head === node && this.tail === node
    if (this.head === node) {
      this.head = this.head.next
    }
    if (this.tail === node) {
      this.tail = this.tail.prev
    }
    if (node.unlink() || onlyNode) {
      this.size -= 1
    }
  }
}

export class DoublyNode<T> {
  prev: DoublyNode<T> | undefined
  next: DoublyNode<T> | undefined
  value: T

  constructor(value: T) {
    this.value = value
  }

  unlink() {
    if (this.prev == null && this.next == null) return false
    if (this.prev != null) {
      this.prev.next = this.next
    }
    if (this.next != null) {
      this.next.prev = this.prev
    }
    this.prev = undefined
    this.next = undefined

    return true
  }
}
