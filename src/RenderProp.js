import React from 'react'
import compare from './compare'

class RenderProp extends React.Component {
  constructor() {
    super()

    if (new.target === RenderProp) {
      console.warn(
        'RenderProp(...): RenderProp is an abstract class! You need to extend it.'
      )
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
        console.warn(
          `RenderProp(...): Please rename ".${reactMethod}" to ".${ourMethod}"`
        )
      }
    }

    this.subscribeTo = this.subscribeTo.bind(this)
  }
  mounted = false
  subscriptions = []
  subscribeTo(store, callback, stateChanged) {
    if (!this.mounted) {
      console.warn(
        'RenderProp(...): Cannot use ".subscribeTo" in an unmounted component. Have you tried using ".didMount"?'
      )
      return
    }

    let prevState = store.getState()
    function callbackWithEqualityCheck() {
      const nextState = store.getState()
      if (compare(prevState, nextState, stateChanged)) {
        prevState = nextState
        callback()
      } else {
        prevState = nextState
      }
    }

    const unsubscribe = store.subscribe(
      stateChanged ? callbackWithEqualityCheck : callback
    )
    this.subscriptions.push(unsubscribe)
    ;(stateChanged ? callbackWithEqualityCheck : callback)()
  }
  componentWillMount() {
    if (this.willMount) this.willMount()
  }
  componentDidMount() {
    this.mounted = true
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

    this.mounted = false
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
      console.warn('RenderProp(...): ".render" prop is missing or invalid')
      return null
    }
  }
}

export default RenderProp
