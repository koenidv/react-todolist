import { TodoEditBox, TodoBoxSummary, TodoInfoText, TodoTitle, TodoTitleCompact, LineWrapper, TodoBox, TodoBody, TodoText } from "./TodoComponents"
import { Checkbox } from "pretty-checkbox-react"
import { shortenYear } from "../baseComponents/Utilities"
import { useState } from "react"
import { BaseButton, BaseButtonAction, BaseButtonBorderless } from "../baseComponents/InputBaseComponents"
import { EditTodo } from "./EditTodo"
import { updateTodo } from "../faunaDb"

export function TodosList({ todos, setTodos }) {
  let returnList = ""
  const [expanded, setExpanded] = useState()
  const [editing, setEditing] = useState()

  const saveEditTodo = (index, id, data) => {
    // Update Task on Fauna
    updateTodo(id, data)
      .then((todo) => {
        // Update local list
        todos[index] = todo
        setTodos(todos)
        // Close editing
        setExpanded(editing)
        setEditing(undefined)
      })
      .catch((err) => data.setMessage("Please try again"))
  }

  if (todos.length > 0) {
    returnList = todos.map((todo, i) => {
      const id = todo.ref.value.id

      const handleSaveEditTodo = (data) => {
        saveEditTodo(i, id, data)
      }

      return (
        <div key={todo.ref.value.id}>
          {expanded !== id && editing !== id && <TodoSummary data={todo.data} id={id} setExpanded={setExpanded} setEditing={setEditing} />}
          {expanded === id && editing !== id && <TodoView data={todo.data} id={id} setExpanded={setExpanded} setEditing={setEditing} />}
          {editing === id && <EditTodo current={todo.data} saveTodo={handleSaveEditTodo} />}
        </div>
      )
    })
  }

  return returnList

}

// A one-line summary of a tasks' checked, title and due properties, and if it has a description
function TodoSummary({ data, id, setExpanded, setEditing }) {

  // Compose the due date
  let dueText = ""
  if (data.due !== undefined) {
    const date = new Date(data.due)
    dueText = isNaN(date) ? ""
      : `${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`
  }

  const handleExpand = () => setExpanded(id)

  return (
    <TodoBoxSummary className={getPriorityClassName(data.priority)} onClick={handleExpand}>
      <TodoCheckbox checked={data.checked} id={id} />
      <TodoTitleCompact>{data.title}</TodoTitleCompact>
      <TodoInfoText>{dueText}{data.descr && " 💬"}</TodoInfoText>
    </TodoBoxSummary>
  )
}


// Display all information in a task
function TodoView({ data, id, setExpanded, setEditing }) {

  // Compose info text: Due Date | Priority
  let infoText = ""
  infoText += getDateString(data.due)
  // Add a pipe if needed and priority
  if (data.priority !== 1) {
    if (infoText !== "") infoText += " | "
    infoText += "Priority " + data.priority
  }

  const handleEdit = () => {
    setExpanded(undefined)
    setEditing(id)
  }
  const handleCollapse = () => setExpanded(undefined)

  return (
    <TodoBox className={getPriorityClassName(data.priority)}>
      <LineWrapper>
        <TodoCheckbox checked={data.checked} id={id} />
        <TodoTitle>{data.title}</TodoTitle>
      </LineWrapper>
      <TodoBody>
        <TodoInfoText>{infoText}</TodoInfoText>
        <TodoText>{data.descr}</TodoText>
        <LineWrapper>
          <BaseButtonAction className="active" style={{ marginRight: "1rem" }}>Mark Complete</BaseButtonAction>
          <BaseButtonBorderless onClick={handleEdit} style={{ marginRight: "1rem" }}>Edit</BaseButtonBorderless>
          <BaseButtonBorderless style={{ marginRight: "1rem" }}>Delete</BaseButtonBorderless>
          <BaseButtonBorderless onClick={handleCollapse} style={{ marginRight: "1rem" }}>Close</BaseButtonBorderless>
        </LineWrapper>
      </TodoBody>
    </TodoBox>
  )
}


// A checkbox with task check/uncheck functionality
function TodoCheckbox({ checked, id }) {

  return <Checkbox bigger checked={checked} />
}


// Returns a date string or empty string for a date in millis
function getDateString(millis) {
  if (millis === undefined) return ""
  const date = new Date(millis)
  return (isNaN(date) ? ""
    : `Due ${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`)
}


// Returns the class name for a task priority
function getPriorityClassName(priority) {
  switch (priority) {
    case 2: return "pr-2"
    case 3: return "pr-3"
    default: return ""
  }
}