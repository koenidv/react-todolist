import { TodoBoxSummary, TodoInfoText, TodoTitleCompact } from "./TodoComponents"
import { Checkbox } from "pretty-checkbox-react"
import { shortenYear } from "../baseComponents/Utilities"

export function TodosList({ todos }) {
  let returnList = ""

  if (todos.length > 0) {
    returnList = todos.map((todo) => (
      <div key={todo.ref.value.id}>
        <TodoSummary data={todo.data} id={todo.ref.value.id} />
      </div>
    ))
  }

  return returnList

}

// A one-line summary of a tasks' checked, title and due properties, and if it has a description
function TodoSummary({ data }) {

  // Display the due date
  let dueText = ""
  if (data.due !== undefined) {
    console.log(data.due)
    const date = new Date(data.due)
    console.log(date)
    dueText = isNaN(date) ? ""
      : `${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`
  }

  return (
    <TodoBoxSummary className={getPriorityClassName(data.priority)}>
      <Checkbox />
      <TodoTitleCompact>{data.title}</TodoTitleCompact>
      <TodoInfoText>{dueText}{data.descr && " 💬"}</TodoInfoText>
    </TodoBoxSummary>
  )
}

// Returns the class name for a task priority
function getPriorityClassName(priority) {
  switch(priority) {
    case 2: return "pr-2"
    case 3: return "pr-3"
    default: return ""
  }
}