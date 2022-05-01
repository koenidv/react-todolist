

export function CreateTodoForm({ addTodo }) {

}

export function TodosList({ todos }) {
    let returnList = ""
    
    if (todos.length > 0) {
      returnList = todos.map((todo) => <li key={todo.ref.value.id}>{todo.data.title}</li>)
    }

    return returnList

}