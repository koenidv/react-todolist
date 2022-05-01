import { BaseButton } from "../baseComponents/InputBaseComponents"
import { ContentArea, PropertiesArea, TodoBox, TodoInputMain, TodoTextArea, TodoButtonAction, TodoButtonMainCreate, TodoButtonText } from "./TodoComponents"
import { useState, useEffect } from "react"
import { createTodo } from "../faunaDb"
import DatePicker from "react-date-picker/dist/entry.nostyle"
import "./DatePickerStyle.scss"

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
        {!createVisible && <TodoButtonMainCreate onClick={handleShowCreate} >Create a Task</TodoButtonMainCreate>}
        {createVisible && <EditTodo saveTodo={handleSaveTodo} />}
    </>)
}

// Form to create / edit a task
export function EditTodo({ saveTodo, className }) {
    const [title, setTitle] = useState("")
    const [description, setDiscription] = useState("")
    const [due, setDue] = useState(null)
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
                <CollapsibleTextArea description={description} setDescription={setDiscription} onKeyDown={handleKeyDown} />
            </ContentArea>
            <PropertiesArea>
                <div>
                    <CalendarButton date={due} setDate={setDue} />
                    <TodoButtonText>Set a Priority</TodoButtonText>
                </div>
                <TodoButtonAction onClick={handleSave} className={title !== "" ? "active" : ""}>{saveText}</TodoButtonAction>
            </PropertiesArea>
        </TodoBox>
    )
}

function CalendarButton({ date, setDate }) {
    const [calendarVisible, setCalendarVisible] = useState(false)
    const today = new Date()

    const handleChange = (date) => setDate(date)

    const showCalendar = () => setCalendarVisible(true)
    const hideCalendar = () => setCalendarVisible(false)

    const shortenYear = (year) => {
        year = year.toString()
        if (/20../.test(year)) return year.slice(-2)
        else return year
    }

    const buttonText = date === null
        ? "Add a Due Date"
        : `Due ${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`

    return (<>
        <TodoButtonText onClick={showCalendar} >{buttonText}</TodoButtonText>
        <DatePicker onChange={handleChange} value={date} isOpen={calendarVisible} onCalendarClose={hideCalendar} minDate={today} />
    </>)

}

// Displays a button to add a description. When clicked, a textarea is displayed
function CollapsibleTextArea({ description, setDescription, onKeyDown }) {
    const [descriptionVisible, setDiscriptionVisible] = useState(false)

    const handleSetDescription = ({ target }) => setDescription(target.value)
    const handleShowDescription = () => setDiscriptionVisible(true)

    return (<>
        {!descriptionVisible && <BaseButton onClick={handleShowDescription} >Add a Description</BaseButton>}
        {descriptionVisible && <TodoTextArea placeholder="Task Description" value={description}
            onChange={handleSetDescription} className={descriptionVisible ? "" : "hidden"}
            onKeyDown={onKeyDown} />}
    </>)
}