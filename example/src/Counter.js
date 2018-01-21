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
  state = {counter: 0}
  didMount() {
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
    const {counter} = this.props

    return (
      <div>
        Value: {counter}
        <br />
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

export default Counter
