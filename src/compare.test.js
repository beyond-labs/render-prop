import compare from './compare'

const filters = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  COMPLETE: 'COMPLETE'
}

const todosState = {
  todos: [
    {title: 'A', selected: false, complete: false},
    {title: 'B', selected: false, complete: false},
    {title: 'C', selected: false, complete: false},
    {title: 'D', selected: false, complete: false}
  ],
  filter: filters.ALL
}

const copyTodosState = () => JSON.parse(JSON.stringify(todosState))

describe('compare', () => {
  it('only checks the provided keys', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    expect(compare(a, b, 'filter')).toBe(false)
    delete a.todos
    expect(compare(a, b, 'filter')).toBe(false)
    b.filter = filters.ACTIVE
    expect(compare(a, b, 'filter')).toBe(true)
  })

  it('uses strict equality to compare objects', () => {
    const a = copyTodosState()
    const b = a
    expect(compare(a, b, 'todos')).toBe(false)
    const c = copyTodosState()
    expect(compare(a, c, 'todos')).toBe(true)
  })

  it('works with dot-seperated "deep" keys', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    b.todos.reverse()
    expect(compare(a, b, 'todos.0.selected')).toBe(false)
    expect(compare(a, b, 'todos.2.title')).toBe(true)
  })

  it('checks all keys in an array', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    expect(compare(a, b, ['filter', 'todos.length'])).toBe(false)
    b.filter = filters.COMPLETE
    expect(compare(a, b, ['filter', 'todos.length'])).toBe(true)
  })

  it('supports keys with iterators (using "[]" or "{}")', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    expect(compare(a, b, 'todos.[].{}')).toEqual(false)
    b.todos[3].selected = true
    expect(compare(a, b, 'todos.[].{}')).toEqual(true)
  })

  it('reports inequality if the length of any two iterators are different', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    b.todos = b.todos.slice(1)
    expect(compare(a, b, 'todos.[].complete')).toBe(true)
  })

  it('uses shallow equality if the comparison is missing', () => {
    const a = copyTodosState()
    const b = a
    expect(compare(a, b)).toBe(false)
    const c = copyTodosState()
    expect(compare(a, c)).toBe(true)
  })

  it('accepts functions (pretty useless, but whatever)', () => {
    const a = copyTodosState()
    const b = copyTodosState()
    expect(
      compare(a, b, (a, b) => JSON.stringify(a) !== JSON.stringify(b))
    ).toBe(false)
  })
})
