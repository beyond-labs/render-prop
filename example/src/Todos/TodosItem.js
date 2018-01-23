import cl from 'classnames'
import React from 'react'
import RenderProp from 'render-prop'
import TodosStore from './TodosStore'
import {todoList, todoItem, ENTER} from './constants'

class TodosItemModel extends RenderProp {
  state = {
    title: '',
    complete: false,
    editing: false,
    dispatch: this.dispatch.bind(this)
  }
  dispatch(action) {
    if (!action.payload) action.payload = {}
    action.payload.id = this.props.id
    TodosStore.dispatch(action)
  }
  didMount() {
    this.update = this.update.bind(this)
    this.subscribeTo(TodosStore, this.update, `todos.${this.props.id}.{}`)
  }
  update() {
    const {id} = this.props
    const {title, complete, editing} = TodosStore.getState().todos[id] || {}

    this.setState({title, complete, editing})
  }
}

class TodosItemView extends React.Component {
  render() {
    const {complete = false, editing = false, title = '', dispatch} = this.props

    return (
      <li
        className={cl({complete, editing})}
        onDoubleClick={() => dispatch({type: todoItem.START_EDITING})}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={complete}
            onChange={e => {
              const type = e.target.checked
                ? todoItem.MARK_COMPLETE
                : todoItem.MARK_ACTIVE
              dispatch({type})
            }}
          />
          <label>{title}</label>
          <button
            className="destroy"
            onClick={() => {
              dispatch({type: todoList.REMOVE_TODO})
            }}
          />
        </div>
        <input
          className="edit"
          onBlur={() => {
            dispatch({type: todoItem.STOP_EDITING})
          }}
          onKeyDown={e => {
            if (e.keyCode === ENTER) dispatch({type: todoItem.STOP_EDITING})
          }}
          onChange={evt => {
            dispatch({
              type: todoItem.UPDATE_TITLE,
              payload: {title: evt.target.value || ''}
            })
          }}
          value={title}
        />
      </li>
    )
  }
}

const TodosItem = ({id}) => (
  <TodosItemModel
    id={id}
    render={({complete, editing, title, dispatch}) => (
      <TodosItemView
        complete={complete}
        editing={editing}
        title={title}
        dispatch={dispatch}
      />
    )}
  />
)

export default TodosItem
