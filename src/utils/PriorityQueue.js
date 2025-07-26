
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    // Find if the element is already in the queue
    const index = this.items.findIndex(qe => qe.element === element);

    if (index !== -1) {
        // If found, update the priority only if new priority is lower
        if (priority < this.items[index].priority) {
            this.items[index].priority = priority;
        }
    } else {
        // If not found, add new element
        this.items.push({ element, priority });
    }
    // Always sort after insertion/update
    this.items.sort((a, b) => a.priority - b.priority);
}

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export default PriorityQueue;
