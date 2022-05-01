import { BaseButton, BaseButtonAction, BaseInput } from "../baseComponents/InputBaseComponents"
import { ContentArea, PropertiesArea, TodoBox, TodoInputMain, TodoTextArea } from "./TodoComponents"
import { useState } from "react"


export function CreateTodoForm({ addTodo }) {
  const [descriptionVisible, setDiscriptionVisible] = useState(false)

  const handleShowDescription = () => setDiscriptionVisible(true)

  return (
    <TodoBox>
      <ContentArea>
        <TodoInputMain placeholder="Title" />
        <BaseButton onClick={handleShowDescription} className={descriptionVisible ? "hidden" : ""}>Add a Description</BaseButton>
        <TodoTextArea placeholder="Task Description" className={descriptionVisible ? "" : "hidden"} />
      </ContentArea>
      <PropertiesArea>
        <BaseButton>Due Date</BaseButton>
        <BaseButton>Priority</BaseButton>
        <BaseButtonAction>Save</BaseButtonAction>
      </PropertiesArea>
    </TodoBox>
  )
}

export function TodosList({ todos }) {
  let returnList = ""

  if (todos.length > 0) {
    returnList = todos.map((todo) => <li key={todo.ref.value.id}>{todo.data.title}</li>)
  }

  return returnList

}