import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

import Timer from './Timer'
import Counter from './Counter'
import Todos from './Todos'
import Network from './Network'

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
          <div className="App-title">
            <h1>Render Prop</h1>
            <a href="https://github.com/beyond-labs/render-prop">
              GitHub & Docs
            </a>{' '}
            pls star!
          </div>
          <p>
            This library makes using the "render prop" technique a little
            easier.
          </p>
        </header>
        <div className="App-content">
          <Section title="Timer" source="Timer.js" component={Timer} />
          <Section title="Counter" source="Counter.js" component={Counter} />
          <Section title="Todos" source="Todos/" component={Todos} />
          <Section title="Network" source="Network.js" component={Network} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
