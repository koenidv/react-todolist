import { BaseButton } from "../baseComponents/InputBaseComponents"
import { ContentArea, PropertiesArea, TodoBox, TodoInputMain, TodoTextArea, TodoButtonAction, TodoButtonMainCreate } from "./TodoComponents"
import { useState, useEffect } from "react"
import { createTodo } from "../faunaDb"

// Displays a button to show the EditTodo component to create a new task
export function CreateTodoButton({ entries, setEntries, expanded }) {
    const [createVisible, setCreateVisible] = useState(expanded)

    const handleShowCreate = () => setCreateVisible(true)
    const handleHideCreate = () => setCreateVisible(false)

    const handleSaveTodo = (task) => {
        setEntries([...entries, task])
        handleHideCreate()
    }

    useEffect(() => {
        setCreateVisible(expanded)
    }, [expanded])

    return (<>
        <TodoButtonMainCreate onClick={handleShowCreate} className={createVisible ? "hidden" : ""}>Create a Task</TodoButtonMainCreate>
        <EditTodo saveTodo={handleSaveTodo} className={createVisible ? "" : "hidden"} />
    </>)
}

// Form to create / edit a task
export function EditTodo({ saveTodo, className }) {
    const [title, setTitle] = useState("")
    const [description, setDiscription] = useState("")
    const [due, setDue] = useState()
    const [priority, setPriority] = useState(1)
    const [saveText, setSaveText] = useState("Save")

    // Handles saving the task
    const handleSave = () => {
        setSaveText("Saving…")
        createTodo(title, description, due, priority, false)
            .then((task) => {
                saveTodo(task)
            })
            .catch((err) => setSaveText("Please try again"))
    }

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === "Enter") handleSave()
    }
    const handleSetTitle = ({ target }) => setTitle(target.value)

    return (
        <TodoBox className={className}>
            <ContentArea>
                <TodoInputMain placeholder="Title" value={title} onChange={handleSetTitle} onKeyDown={handleKeyDown} />
                <HiddenDescription description={description} setDescription={setDiscription} onKeyDown={handleKeyDown} />
            </ContentArea>
            <PropertiesArea>
                <div>
                    <BaseButton>Add a Due Date</BaseButton>
                    <BaseButton>Set a Priority</BaseButton>
                </div>
                <TodoButtonAction onClick={handleSave} className={title !== "" ? "active" : ""}>{saveText}</TodoButtonAction>
            </PropertiesArea>
        </TodoBox>
    )
}

// Displays a button to add a description. When clicked, a textarea is displayed
function HiddenDescription({ description, setDescription, onKeyDown }) {
    const [descriptionVisible, setDiscriptionVisible] = useState(false)

    const handleSetDescription = ({ target }) => setDescription(target.value)
    const handleShowDescription = () => setDiscriptionVisible(true)

    return (<>
        <BaseButton onClick={handleShowDescription}
            className={descriptionVisible ? "hidden" : ""}>Add a Description</BaseButton>
        <TodoTextArea placeholder="Task Description" value={description}
            onChange={handleSetDescription} className={descriptionVisible ? "" : "hidden"}
            onKeyDown={onKeyDown} />
    </>)
}