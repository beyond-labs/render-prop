class Store {
  constructor(reducer) {
    this.reducer = reducer
  }
  reducer = () => {}
  state = undefined
  listeners = {}
  subscribe(callback) {
    const id = Math.random()
      .toString()
      .slice(2)

    this.listeners[id] = callback
    const unsubscribe = () => delete this.listeners[id]
    return unsubscribe
  }
  dispatch(action) {
    const listeners = this.listeners
    this.state = this.reducer(action)
    for (const k in listeners) listeners[k]()
  }
  getState() {
    return this.state
  }
}

export default Store
