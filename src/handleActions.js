const handleActions = (handlers, initialState) => {
  const handleActionsInner = (state = initialState, action) => {
    if (action && handlers[action.type]) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
  return handleActionsInner
}
