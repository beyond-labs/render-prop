import React from 'react'
import Header from './TodosHeader'
import TodosList from './TodosList'
import Footer from './TodosFooter'

const Todos = () => {
  return (
    <div className="Todos-container">
      <div className="Todos">
        <section className="todoapp">
          <Header />
          <TodosList />
          <Footer />
        </section>
      </div>
    </div>
  )
}

export default Todos
