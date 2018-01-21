import React from 'react'
import TodosStore from './TodosStore'
import {todoList, ENTER} from './constants'

class TodosHeader extends React.Component {
  state = {
    value: ''
  }
  addTodo(title) {
    TodosStore.dispatch({type: todoList.ADD_TODO, payload: title})
  }
  render() {
    const {value} = this.state

    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          value={value}
          onChange={e => {
            const value = e.target.value
            this.setState({value})
          }}
          onKeyDown={e => {
            if (e.keyCode === ENTER && this.state.value) {
              this.addTodo(value)
              this.setState({value: ''})
            } else {
            }
          }}
          placeholder="What needs to be done?"
        />
      </header>
    )
  }
}

export default TodosHeader
