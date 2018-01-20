# Render Prop

The term "render prop" ([reactjs.org/docs/render-props](https://reactjs.org/docs/render-props.html)) refers to a simple technique for sharing code between React components using a prop whose value is a function.

This library makes using the technique a little easier. Here the "render prop" is called with the value of `this.state`:

```js
import RenderProp from 'render-prop'

class TimerModel extends RenderProp {
  constructor() {
    super()
    this.state = {counter: 0}
    this.interval = setInterval(() => {
      this.setState({counter: this.state.seconds + 1})
    }, 1000)
  }
  willUnmount() {
    clearInterval(this.interval)
  }
}

class TimerView extends React.Component {
  render() {
    const {seconds} = this.props
    return <span>{seconds} seconds</span>
  }
}

const Timer = () => (
  <TimerModel render={({seconds}) => <TimerView seconds={seconds}>} />
)
```

###### Integrating with Stores

Stores help manage state. Here we subscribe to updates on a global store (via `this.subscribeTo`):

```js
import React from 'react'
import RenderProp, {Store} from 'render-prop'

const CounterStore = new Store(
  (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return {counter: state.counter + action.payload}
      default:
        return state
    }
  },
  {counter: 0}
)

class CounterModel extends RenderProp {
  constructor() {
    super()
    this.state = {counter: 0}
    this.update = this.update.bind(this)
    this.subscribeTo(CounterStore, this.update)
  }
  update() {
    const {counter} = CounterStore.getState()
    this.setState({counter})
  }
}

class CounterView extends React.Component {
  render() {
    return (
      <div>
        Value: {counter}
        <button
          onClick={() => CounterStore.dispatch({type: 'INCREMENT', payload: 1})}
        >
          Increment
        </button>
      </div>
    )
  }
}

const Counter = () => (
  <CounterModel render={({counter}) => <CounterView counter={counter} />} />
)
```

> `Store` is provided for convenience, however `this.subscribeTo` also works with [Redux](https://redux.js.org/).

###### Using Lifecycle Methods

Models created by `render-prop` are a simple extension of React components. You can use props, state and lifecycle methods just like you would anywhere else. These methods are available:

* _willMount()_
* _didMount()_
* _willReceiveProps(nextProps)_
* _shouldUpdate(nextProps, nextState)_
* _willUpdate(nextProps, nextState)_
* _didUpdate(prevProps, prevState)_
* _willUnmount()_
* _didCatch()_

> We've removed the word "component" from the lifecycle methods to avoid naming collisions with the library itself.

###### Improving Performance

We want to update our view when one of our `todos` changes, but not when changes occur in other (unrelated) parts of the store's state. You can optionally pass a selector (or array of selectors) to `this.subscribeTo`; now the callback will only be activated when this part of the store's state changes:

```js
class TodosModel extends RenderProp {
  constructor() {
    super()
    this.update = this.bind.update()
    // shallow equality check on every todo in `GlobalStore.getState().todos`
    this.subscribeTo(GlobalStore, this.update, 'todos.[].{}')
  }
  update() {
    /* ... */
  }
}
```

The `compare` utility implements the selector-based comparison above. Here's how you can use it independently:

```js
import {compare} from 'render-prop'

// returns `true` if something changed
compare(stateA, stateB, ['todos.[].{}', 'filter'])
```
