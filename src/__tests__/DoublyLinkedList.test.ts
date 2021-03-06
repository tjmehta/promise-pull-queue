import { DoublyLinkedList } from '../DoublyLinkedList'

describe('doublylinkedlist', () => {
  it('should push values', () => {
    const list = new DoublyLinkedList<number>()
    const nodes = []
    expect(list.size).toMatchInlineSnapshot(`0`)
    nodes.push(list.push(10))
    expect(list.size).toMatchInlineSnapshot(`1`)
    expect(list.head).toBe(nodes[0])
    expect(list.tail).toBe(nodes[0])
    expect(nodes[0].prev).toBe(undefined)
    expect(nodes[0].next).toBe(undefined)
    nodes.push(list.push(20))
    expect(list.size).toMatchInlineSnapshot(`2`)
    expect(list.head).toBe(nodes[0])
    expect(list.tail).toBe(nodes[1])
    expect(nodes[0].prev).toBe(undefined)
    expect(nodes[0].next).toBe(nodes[1])
    expect(nodes[1].prev).toBe(nodes[0])
    expect(nodes[1].next).toBe(undefined)
    nodes.push(list.push(30))
    expect(list.size).toMatchInlineSnapshot(`3`)
    expect(list.head === nodes[0]).toBeTruthy()
    expect(list.tail === nodes[2]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === nodes[1]).toBeTruthy()
    expect(nodes[1].prev === nodes[0]).toBeTruthy()
    expect(nodes[1].next === nodes[2]).toBeTruthy()
    expect(nodes[2].prev === nodes[1]).toBeTruthy()
    expect(nodes[2].next === undefined).toBeTruthy()
  })

  it('should shift values', () => {
    const list = new DoublyLinkedList<number>()
    const nodes = []
    const values = []
    expect(list.size).toMatchInlineSnapshot(`0`)
    nodes.push(list.push(10))
    nodes.push(list.push(20))
    nodes.push(list.push(30))
    nodes.push(list.push(40))
    nodes.push(list.push(50))
    expect(list.size).toMatchInlineSnapshot(`5`)
    expect(list.head === nodes[0]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === nodes[1]).toBeTruthy()
    expect(nodes[1].prev === nodes[0]).toBeTruthy()
    expect(nodes[1].next === nodes[2]).toBeTruthy()
    expect(nodes[2].prev === nodes[1]).toBeTruthy()
    expect(nodes[2].next === nodes[3]).toBeTruthy()
    expect(nodes[3].prev === nodes[2]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()

    // shift
    values.push(list.shift())
    expect(values[values.length - 1]).toMatchInlineSnapshot(`10`)
    expect(list.size).toMatchInlineSnapshot(`4`)
    expect(list.head === nodes[1]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === nodes[2]).toBeTruthy()
    expect(nodes[2].prev === nodes[1]).toBeTruthy()
    expect(nodes[2].next === nodes[3]).toBeTruthy()
    expect(nodes[3].prev === nodes[2]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()
    // shift
    values.push(list.shift())
    expect(values[values.length - 1]).toMatchInlineSnapshot(`20`)
    expect(list.size).toMatchInlineSnapshot(`3`)
    expect(list.head === nodes[2]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === undefined).toBeTruthy()
    expect(nodes[2].prev === undefined).toBeTruthy()
    expect(nodes[2].next === nodes[3]).toBeTruthy()
    expect(nodes[3].prev === nodes[2]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()
    // shift
    values.push(list.shift())
    expect(values[values.length - 1]).toMatchInlineSnapshot(`30`)
    expect(list.size).toMatchInlineSnapshot(`2`)
    expect(list.head === nodes[3]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === undefined).toBeTruthy()
    expect(nodes[2].prev === undefined).toBeTruthy()
    expect(nodes[2].next === undefined).toBeTruthy()
    expect(nodes[3].prev === undefined).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()
    // shift
    values.push(list.shift())
    expect(values[values.length - 1]).toMatchInlineSnapshot(`40`)
    expect(list.size).toMatchInlineSnapshot(`1`)
    expect(list.head === nodes[4]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === undefined).toBeTruthy()
    expect(nodes[2].prev === undefined).toBeTruthy()
    expect(nodes[2].next === undefined).toBeTruthy()
    expect(nodes[3].prev === undefined).toBeTruthy()
    expect(nodes[3].next === undefined).toBeTruthy()
    expect(nodes[4].prev === undefined).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()
  })

  it('should delete nodes', () => {
    const list = new DoublyLinkedList<number>()
    const nodes = []
    const values = []
    expect(list.size).toMatchInlineSnapshot(`0`)
    nodes.push(list.push(10))
    nodes.push(list.push(20))
    nodes.push(list.push(30))
    nodes.push(list.push(40))
    nodes.push(list.push(50))
    expect(list.size).toMatchInlineSnapshot(`5`)
    expect(list.head === nodes[0]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === nodes[1]).toBeTruthy()
    expect(nodes[1].prev === nodes[0]).toBeTruthy()
    expect(nodes[1].next === nodes[2]).toBeTruthy()
    expect(nodes[2].prev === nodes[1]).toBeTruthy()
    expect(nodes[2].next === nodes[3]).toBeTruthy()
    expect(nodes[3].prev === nodes[2]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()

    list.deleteNode(nodes[0])
    expect(list.size).toMatchInlineSnapshot(`4`)
    expect(list.head === nodes[1]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === nodes[2]).toBeTruthy()
    expect(nodes[2].prev === nodes[1]).toBeTruthy()
    expect(nodes[2].next === nodes[3]).toBeTruthy()
    expect(nodes[3].prev === nodes[2]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()

    list.deleteNode(nodes[2])
    expect(list.size).toMatchInlineSnapshot(`3`)
    expect(list.head === nodes[1]).toBeTruthy()
    expect(list.tail === nodes[4]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === nodes[3]).toBeTruthy()
    expect(nodes[2].prev === undefined).toBeTruthy()
    expect(nodes[2].next === undefined).toBeTruthy()
    expect(nodes[3].prev === nodes[1]).toBeTruthy()
    expect(nodes[3].next === nodes[4]).toBeTruthy()
    expect(nodes[4].prev === nodes[3]).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()

    list.deleteNode(nodes[4])
    expect(list.size).toMatchInlineSnapshot(`2`)
    expect(list.head === nodes[1]).toBeTruthy()
    expect(list.tail === nodes[3]).toBeTruthy()
    expect(nodes[0].prev === undefined).toBeTruthy()
    expect(nodes[0].next === undefined).toBeTruthy()
    expect(nodes[1].prev === undefined).toBeTruthy()
    expect(nodes[1].next === nodes[3]).toBeTruthy()
    expect(nodes[2].prev === undefined).toBeTruthy()
    expect(nodes[2].next === undefined).toBeTruthy()
    expect(nodes[3].prev === nodes[1]).toBeTruthy()
    expect(nodes[3].next === undefined).toBeTruthy()
    expect(nodes[4].prev === undefined).toBeTruthy()
    expect(nodes[4].next === undefined).toBeTruthy()
  })
})
