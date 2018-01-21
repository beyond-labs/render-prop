import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

import Timer from './Timer'
import Counter from './Counter'

class Section extends React.Component {
  render() {
    const {title, source, component: Component} = this.props

    return (
      <section className="Section-container">
        <div className="Section-header">
          <h2>{title}</h2>
          <a
            href={`https://github.com/beyond-labs/render-prop/tree/master/example/src/${source}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            view source
          </a>
        </div>
        <div className="Section-content">
          <Component />
        </div>
      </section>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App-container">
        <header className="App-header">
          <h1>Render Prop</h1>
        </header>
        <div className="App-content">
          <Section title="Timer" source="Timer.js" component={Timer} />
          <Section title="Counter" source="Counter.js" component={Counter} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
