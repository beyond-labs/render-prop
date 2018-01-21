class Store {
  constructor(reducer, initalState) {
    this.reducer = reducer
    this.state = initalState

    this.subscribe = this.subscribe.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.getState = this.getState.bind(this)
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
    this.state = this.reducer(this.state, action)
    for (const k in listeners) listeners[k]()
  }
  getState() {
    return this.state
  }
}

export default Store
