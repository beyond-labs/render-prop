import cl from 'classnames'
import React from 'react'
import RenderProp, {compare} from 'render-prop'
import TodosStore from './TodosStore'
import {todoList, filters} from './constants'

class TodosFooterModel extends RenderProp {
  state = {
    updateFilter: this.updateFilter.bind(this),
    clearCompleted: this.clearCompleted.bind(this)
  }
  updateFilter(filter) {
    TodosStore.dispatch({type: todoList.SET_FILTER, payload: filter})
  }
  clearCompleted() {
    TodosStore.dispatch({type: todoList.CLEAR_COMPLETED})
  }
  didMount() {
    this.update = this.update.bind(this)
    this.update()
    this.subscribeTo(TodosStore, this.update, [
      'order.length',
      'todos.{}.complete',
      'filter'
    ])
  }
  update() {
    const {todos, filter} = TodosStore.getState()
    let todosCount = 0
    let activeTodosCount = 0
    for (const k in todos) {
      todosCount += 1
      const todo = todos[k]
      if (!todo.complete) activeTodosCount += 1
    }
    this.setState({todosCount, activeTodosCount, filter})
  }
}

class TodosFooterView extends React.Component {
  shouldComponentUpdate(nextState) {
    return compare(this.state, nextState, [
      'todosCount',
      'activeTodosCount',
      'filter'
    ])
  }
  render() {
    const {
      todosCount,
      activeTodosCount,
      filter,
      updateFilter,
      clearCompleted
    } = this.props

    return (
      <footer
        className="footer"
        style={todosCount ? undefined : {display: 'none'}}
      >
        <span className="todo-count">
          <strong>{activeTodosCount}</strong>{' '}
          {activeTodosCount === 1 ? 'item' : 'items'} left
        </span>
        <ul className="filters">
          <li>
            <a
              className={cl({selected: filter === filters.ALL})}
              onClick={() => updateFilter(filters.ALL)}
            >
              All
            </a>
          </li>
          <li style={{listStyle: 'none'}}>
            <span />
          </li>
          <li>
            <a
              className={cl({selected: filter === filters.ACTIVE})}
              onClick={() => updateFilter(filters.ACTIVE)}
            >
              Active
            </a>
          </li>
          <li style={{listStyle: 'none'}}>
            <span />
          </li>
          <li>
            <a
              className={cl({selected: filter === filters.COMPLETE})}
              onClick={() => updateFilter(filters.COMPLETE)}
            >
              Completed
            </a>
          </li>
        </ul>
        {todosCount > activeTodosCount ? (
          <button className="clear-completed" onClick={() => clearCompleted()}>
            Clear completed
          </button>
        ) : null}
      </footer>
    )
  }
}

const TodosFooter = () => (
  <TodosFooterModel
    render={({
      todosCount,
      activeTodosCount,
      filter,
      updateFilter,
      clearCompleted
    }) => (
      <TodosFooterView
        todosCount={todosCount}
        activeTodosCount={activeTodosCount}
        filter={filter}
        updateFilter={updateFilter}
        clearCompleted={clearCompleted}
      />
    )}
  />
)

export default TodosFooter
