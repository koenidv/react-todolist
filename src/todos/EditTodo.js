import { BaseButton } from "../baseComponents/InputBaseComponents"
import { ContentArea, PropertiesArea, TodoBox, TodoInputMain, TodoTextArea, TodoButtonAction, TodoButtonMainCreate, TodoButtonText, PrioritiesWrapper, TodoInfoText, TodoButtonToggle } from "./TodoComponents"
import { useState, useEffect } from "react"
import { createTodo } from "../faunaDb"
import DatePicker from "react-date-picker/dist/entry.nostyle"
import "./DatePickerStyle.scss"
import { shortenYear } from "../baseComponents/Utilities"


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
    const [priority, setPriority] = useState(0)
    const [saveText, setSaveText] = useState("Save")

    // Handles saving the task
    const handleSave = () => {
        // If no title is specified, do nothing
        if (title === "") return

        setSaveText("Saving…")
        if (priority === 0) setPriority(1)
        // Convert the due date to string
        const dueString = due ? due.getTime() : ""

        // Create Task on Fauna
        createTodo(title, description, dueString, priority, false)
            .then((task) => {
                // Add to display list or update
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
                    <PrioritySelection priority={priority} setPriority={setPriority} />
                </div>
                <TodoButtonAction onClick={handleSave} className={title !== "" ? "active" : ""}>{saveText}</TodoButtonAction>
            </PropertiesArea>
        </TodoBox>
    )
}


// Displays a button that opens a date picker popup when clicked
function CalendarButton({ date, setDate }) {
    const [calendarVisible, setCalendarVisible] = useState(false)
    const today = new Date()

    const handleChange = (date) => setDate(date)

    const showCalendar = () => setCalendarVisible(true)
    const hideCalendar = () => setCalendarVisible(false)

    // If no date is selected, prompt to pick one, else display it
    const buttonText = date === null ? "Add a Due Date"
        : `Due ${date.getDate()}.${date.getMonth()}.${shortenYear(date.getFullYear())}`

    return (<>
        <TodoButtonText onClick={showCalendar} >{buttonText}</TodoButtonText>
        <DatePicker onChange={handleChange} value={date} isOpen={calendarVisible} onCalendarClose={hideCalendar} minDate={today} />
    </>)
}


// 3 Selection Buttons for Priorites 1, 2, 3
function PrioritySelection({ priority, setPriority }) {
    return (
        <PrioritiesWrapper>
            <TodoInfoText style={{ marginRight: "1rem" }}>Priority</TodoInfoText>
            <SelectButton value={1} selected={priority} setSelected={setPriority} />
            <SelectButton value={2} selected={priority} setSelected={setPriority} />
            <SelectButton value={3} selected={priority} setSelected={setPriority} />
        </PrioritiesWrapper>
    )
}

// Toggle button to be part of a toggle group
function SelectButton({ value, selected, setSelected, children }) {
    const handleSelection = ({ target }) => setSelected(Number(target.value))

    return (
        <TodoButtonToggle
            value={value}
            className={selected === value ? "selected" : ""}
            onClick={handleSelection}>
            {children || value}
        </TodoButtonToggle>)
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