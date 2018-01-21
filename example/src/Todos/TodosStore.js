import {Store} from 'render-prop'
import {filters, todoList, todoItem} from './constants'

const initialState = Object.assign(
  {
    order: [], // id
    todos: {}, // title, complete, editing, id
    filter: filters.ALL,
    input: ''
  },
  JSON.parse(sessionStorage.getItem('todos') || '{}')
)

const copyImplementedBadly = obj => JSON.parse(JSON.stringify(obj))

function reducer(state, action) {
  state = copyImplementedBadly(state)

  switch (action.type) {
    case todoList.SET_FILTER: {
      state.filter = action.payload
      return state
    }
    case todoList.ADD_TODO: {
      const title = action.payload
      const id = Math.random()
        .toString()
        .slice(2)

      const todo = {title, complete: false, editing: false, id}
      state.todos[id] = todo
      state.order.push(id)

      return state
    }
    case todoList.REMOVE_TODO: {
      const {id} = action.payload

      state.order = state.order.filter(id2 => id2 !== id)
      delete state.todos[id]

      return state
    }
    case todoList.CLEAR_COMPLETED: {
      let idsToRemove = []
      for (const id in state.todos) {
        if (state.todos[id].complete) {
          idsToRemove.push(id)
          delete state.todos[id]
        }
      }

      idsToRemove = new Set(idsToRemove)
      state.order = state.order.filter(id => !idsToRemove.has(id))

      return state
    }

    case todoItem.UPDATE_TITLE: {
      const {id, title} = action.payload
      state.todos[id].title = title
      return state
    }
    case todoItem.MARK_COMPLETE: {
      const {id} = action.payload
      state.todos[id].complete = true
      return state
    }
    case todoItem.MARK_ACTIVE: {
      const {id} = action.payload
      state.todos[id].complete = false
      return state
    }
    case todoItem.START_EDITING: {
      const {id} = action.payload
      state.todos[id].editing = true
      return state
    }
    case todoItem.STOP_EDITING: {
      const {id} = action.payload
      state.todos[id].editing = false
      return state
    }
    default: {
      return state
    }
  }
}

const TodosStore = new Store(reducer, initialState)

const cacheState = () => {
  let {order, todos} = TodosStore.getState()
  todos = {...todos}
  for (const id in todos) {
    todos[id] = {...todos[id]}
    todos[id].editing = false
  }
  const stateToCache = {order, todos}
  sessionStorage.setItem('todos', JSON.stringify(stateToCache))
}

TodosStore.subscribe(cacheState)

window.TodosStore = TodosStore

export default TodosStore
