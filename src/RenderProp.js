import React from 'react'

class RenderProp extends React.Component {
  constructor() {
    super()

    if (new.target === RenderProp) {
      console.warn('RenderProp is an abstract class! You need to extend it.')
    }

    const reactLifecycleMethods = {
      componentWillMount: 'willMount',
      componentDidMount: 'didMount',
      componentWillRecieveProps: 'willRecieveProps',
      shouldComponentUpdate: 'shouldUpdate',
      componentWillUpdate: 'willUpdate',
      componentDidUpdate: 'didUpdate',
      componentWillUnmount: 'willUnmount',
      componentDidCatch: 'didCatch'
    }

    for (const reactMethod in reactLifecycleMethods) {
      const ourMethod = reactLifecycleMethods[reactMethod]
      if (new.target.prototype.hasOwnProperty(reactMethod)) {
        console.warn(`please rename ".${reactMethod}" to ".${ourMethod}"`)
      }
    }
  }
  subscriptions = []
  subscribeTo(store, callback) {
    const unsubscribe = store.subscribe(callback)
    this.subscriptions.push(unsubscribe)
  }
  componentWillMount() {
    if (this.willMount) this.willMount()
  }
  componentDidMount() {
    if (this.didMount) this.didMount()
  }
  componentWillReceiveProps(nextProps) {
    if (this.willReceiveProps) this.willReceiveProps(nextProps)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.shouldUpdate) return this.shouldUpdate(nextProps, nextState)
    else return true
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.willUpdate) this.willUpdate(nextProps, nextState)
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.didUpdate) this.didUpdate(prevProps, prevState)
  }
  componentWillUnmount() {
    if (this.willUnmount) this.willUnmount()

    // except for this line, RenderProp's lifecycle methods behave identically
    // to React's. we renamed every method for consistency.
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
  componentDidCatch() {
    if (this.didCatch) this.didCatch()
  }
  render() {
    const render = this.props.render || this.props.children
    const state = this.state || {}

    if (render instanceof React.Component) {
      const Component = render
      return <Component {...state} />
    } else if (typeof render === 'function') {
      return render(state)
    } else {
      console.warn('".render" prop is missing or invalid')
      return null
    }
  }
}

export default RenderProp
