export class DoublyLinkedList<T> {
  size = 0
  head: DoublyNode<T> | undefined
  tail: DoublyNode<T> | undefined

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
    this.size -= 1

    return removed.value
  }

  deleteNode(node: DoublyNode<T>) {
    if (this.head === node) {
      this.head = this.head.next
    }
    if (this.tail === node) {
      this.tail = this.tail.prev
    }
    node.unlink()
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
    if (this.prev != null) {
      this.prev.next = this.next
    }
    if (this.next != null) {
      this.next.prev = this.prev
    }
    this.prev = undefined
    this.next = undefined
  }
}
