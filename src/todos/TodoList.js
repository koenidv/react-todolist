import { TodoBoxSummary, TodoInfoText, TodoTitle, TodoTitleCompact, LineWrapper, TodoBox, TodoBody, TodoText, TodoSummaryActionsWrapper, TodoActionIcon, TodosWrapper } from "./TodoComponents"
import { Checkbox } from "pretty-checkbox-react"
import { shortenYear } from "../baseComponents/Utilities"
import { useState } from "react"
import { BaseButtonAction, BaseButtonBorderless } from "../baseComponents/InputBaseComponents"
import { EditTodo } from "./EditTodo"
import { deleteTodo, updateTodo, updateTodoChecked } from "../faunaDb"
import imgEdit from "../assets/edit.svg"
import imgDelete from "../assets/delete.svg"

export function TodosList({ todos, setTodos, others, setOthers }) {
  let returnList = ""
  const [expanded, setExpanded] = useState()
  const [editing, setEditing] = useState()

  /*
   * Editing functions
   */

  // Update an edited todo on Fauna and update it in the local list
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

  // Updates the checked status on Fauna and in the local list
  const checkTodo = (index, id, checked) => {
    // Locally update checked property
    todos[index].data.checked = checked
    // If lists for un/checked are separated, move to other list
    if (others && setOthers) {
      setOthers([todos[index], ...others])
      todos.splice(index, 1)
      setTodos([...todos])
    } else {
      //Save edited task, in a copied array to make React update the component
      setTodos([...todos])
    }
    // Mark the Task as checked on Fauna
    updateTodoChecked(id, checked)
      .catch((err) => console.error("Something went wrong trying to update a task"))
    // Collapse all tasks
    setExpanded(undefined)
  }

  // Delete a todo and remove it from the local list
  const doDeleteTodo = (index, id) => {
    deleteTodo(id)
      .then((res) => {
        // Remove the affected todo from todos list
        todos.splice(index, 1)
        setTodos([...todos])
      })
      .catch((err) => console.error("Something went wrong deleting a task"))
  }

  /*
   * Map todos to components
   */

  if (todos.length > 0) {
    // Map every todo to a JSX element
    returnList = todos.map((todo, i) => {
      const id = todo.ref.value.id

      // Handle saving an edited todo, 
      // calls the function above with more parameters
      const handleSaveEditTodo = (data) => saveEditTodo(i, id, data)

      // Handle checking or unchecking a task
      const handleCheckTodo = ({ target }) => checkTodo(i, id, target.checked)

      // Handle deleting a task
      const handleDeleteTodo = () => doDeleteTodo(i, id)

      return (
        <div key={todo.ref.value.id}>
          {expanded !== id && editing !== id && <TodoSummary data={todo.data} id={id} setExpanded={setExpanded} setEditing={setEditing} handleCheckTodo={handleCheckTodo} handleDelete={handleDeleteTodo} />}
          {expanded === id && editing !== id && <TodoView data={todo.data} id={id} setExpanded={setExpanded} setEditing={setEditing} handleCheckTodo={handleCheckTodo} handleDelete={handleDeleteTodo} />}
          {editing === id && <EditTodo current={todo.data} saveTodo={handleSaveEditTodo} />}
        </div>
      )
    })
  }

  return returnList

}

// A one-line summary of a tasks' checked, title and due properties, and if it has a description
function TodoSummary({ data, id, setExpanded, setEditing, handleCheckTodo, handleDelete }) {

  // Compose the due date
  let dueText = ""
  if (data.due !== undefined) {
    const date = new Date(data.due)
    dueText = isNaN(date) ? ""
      : `${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`
  }

  const handleExpand = () => setExpanded(id)
  const handleEdit = () => setEditing(id)

  return (
    <TodoBoxSummary className={getPriorityClassName(data.priority)} onClick={handleExpand}>
      <LineWrapper>
        <TodoCheckbox checked={data.checked} handleChecked={handleCheckTodo} id={id} />
        <TodoTitleCompact>{data.title}</TodoTitleCompact>
        <TodoInfoText>{dueText}</TodoInfoText>
        <TodoSummaryActionsWrapper>
          <TodoActionIcon src={imgEdit} onClick={handleEdit} title="Edit" />
          <TodoActionIcon src={imgDelete} onClick={handleDelete} title="Delete" />
        </TodoSummaryActionsWrapper>
      </LineWrapper>
      <TodoBody>
        <TodoInfoText>{data.descr}</TodoInfoText>
      </TodoBody>
    </TodoBoxSummary>
  )
}


// Display all information in a task
function TodoView({ data, id, setExpanded, setEditing, handleCheckTodo, handleDelete }) {

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
        <TodoCheckbox checked={data.checked} handleChecked={handleCheckTodo} id={id} />
        <TodoTitle>{data.title}</TodoTitle>
      </LineWrapper>
      <TodoBody>
        <TodoInfoText>{infoText}</TodoInfoText>
        <TodoText>{data.descr}</TodoText>
        <LineWrapper>
          {data.checked && <BaseButtonAction onClick={handleCheckTodo} checked={false} className="active" style={{ marginRight: "1rem" }}>Mark Incomplete</BaseButtonAction>}
          {!data.checked && <BaseButtonAction onClick={handleCheckTodo} checked={true} className="active" style={{ marginRight: "1rem" }}>Mark Complete</BaseButtonAction>}
          <BaseButtonBorderless onClick={handleEdit} style={{ marginRight: "1rem" }}>Edit</BaseButtonBorderless>
          <BaseButtonBorderless onClick={handleDelete} style={{ marginRight: "1rem" }}>Delete</BaseButtonBorderless>
          <BaseButtonBorderless onClick={handleCollapse} style={{ marginRight: "1rem" }}>Cancel</BaseButtonBorderless>
        </LineWrapper>
      </TodoBody>
    </TodoBox>
  )
}


// A controlled checkbox ;)
function TodoCheckbox({ checked, handleChecked, id }) {
  return <Checkbox bigger checked={checked} onChange={handleChecked} />
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