const handleActions = (handlers, initialState) => {
  const reducer = (state = initialState, action) => {
    if (action && handlers[action.type]) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
  return reducer
}

export default handleActions
