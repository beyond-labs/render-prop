import React from 'react'
import RenderProp from 'render-prop'

class TimerModel extends RenderProp {
  state = {seconds: 0}
  didMount() {
    this.interval = setInterval(() => {
      this.setState({seconds: this.state.seconds + 1})
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
  <TimerModel render={({seconds}) => <TimerView seconds={seconds} />} />
)

export default Timer
