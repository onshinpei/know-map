// 考察链表



class Node {
  constructor(element, next) {
    this.element = element
    this.next = next
  }
}

class LinkedList {
  constructor() {
    this.head = null
    this.size = 0
  }

  _node(index) {
    if (index < 0 || index >= this.size) {
      new Error('边界越界')
    }
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  add(index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) {
      new Error('边界越界')
    }
    if (index === 0) {
      let head = this.head
      let newHead = new Node(element, head)
      let last = this.size === 0 ? newHead : this._node(this.size - 1)
      this.head = newHead
      last.next = newHead
      this.size++
    } else {
      let prevNode = this._node(index - 1)
      prevNode.next = new Node(element, prevNode.next)
      this.size++
    }
  }

  get(index) {
    return this._node(index)
  }

  set(index, element) {
    this._node(index).element = element
  }
  remove(index) {
    if (index === 0) {
      if (this.size === 1) {
        this.clear()
        return
      }
      let last = this._node(this.size - 1)
      this.head = this.head.next
      last.next = this.head
      this.size--
    } else {
      let prevNode = this._node(index - 1)
      prevNode.next = prevNode.next.next
      this.size--
    }
  }
  clear() {
    this.head = null
    this.size = 0
  }
  reverse() {
    let head = this.head
    let newHead = null
    while (head) {
      let temp = head.next
      head.next = newHead
      head = temp
    }
  }
}

function reverseLinkedList(ll) {
  const ll2 = new LinkedList()
  for (let i = ll.size - 1; i >= 0; i--) {
    let current = ll.get(i)
    ll2.add(current.element)
  }
  return ll2
}


let ll = new LinkedList()

ll.add(3)
ll.add(1, 100)
ll.add(4)
ll.add(5)

console.log(ll)


// class Map {
//   constructor() {
//     this.stacks = []
//   }
//   get(key) {
//     if (isNaN(key)) {
//       key = 'NaN'
//     }
//     return this.stacks.find((item) => {
//       return item.key === key
//     })
//   }
//   set(key, value) {
//     if (isNaN(key)) {
//       key = 'NaN'
//     }
//     const item = this.get(key)
//     if (item) {
//       item.value = value
//     } else {
//       this.stacks.push({ key, value })
//     }
//   }
// }

// const map = new Map()
// const fn = function () { return 3 }
// map.set('a', [32, 22])

// map.set(fn, [22, 55])

// map.set(NaN, 3)

// console.log(map)