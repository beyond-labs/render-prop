import React from 'react'
import RenderProp from 'render-prop'
import TodosStore from './TodosStore'
import TodosItem from './TodosItem'
import {filters, todoItem} from './constants'

class TodosListModel extends RenderProp {
  state = {
    todos: [],
    filter: filters.ALL,
    markAllAsComplete: this.markAllAsComplete.bind(this)
  }
  markAllAsComplete() {
    const {todos} = this.state
    const allComplete = todos.every(todo => todo.complete)

    const type = allComplete ? todoItem.MARK_ACTIVE : todoItem.MARK_COMPLETE

    todos.forEach(todo => TodosStore.dispatch({type, payload: {id: todo.id}}))
  }
  didMount() {
    this.update = this.update.bind(this)
    this.subscribeTo(TodosStore, this.update, [
      'order.[]',
      'todos.{}.complete',
      'filter'
    ])
  }
  update() {
    const {order, todos: todosObject, filter} = TodosStore.getState()

    const todos = []
    for (const i in order) {
      const k = order[i]
      todos.push(todosObject[k])
    }

    this.setState({todos, filter})
  }
}

class TodosListView extends React.Component {
  render() {
    const {todos, filter, markAllAsComplete} = this.props

    return (
      <section
        className="main"
        style={todos.length ? undefined : {display: 'none'}}
      >
        <input
          className="toggle-all"
          type="checkbox"
          onChange={() => {
            markAllAsComplete()
          }}
          checked={todos.every(todo => todo.complete)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos
            .filter(({complete}) => {
              if (filter === 'ALL') return true
              if (filter === 'ACTIVE') return !complete
              if (filter === 'COMPLETE') return complete
              return true
            })
            .map(todo => <TodosItem key={todo.id} id={todo.id} />)}
        </ul>
      </section>
    )
  }
}

const TodosList = () => (
  <TodosListModel
    render={({todos, filter, markAllAsComplete}) => (
      <TodosListView
        todos={todos}
        filter={filter}
        markAllAsComplete={markAllAsComplete}
      />
    )}
  />
)

export default TodosList
