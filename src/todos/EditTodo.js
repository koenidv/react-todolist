import { BaseButton } from "../baseComponents/InputBaseComponents"
import { ContentArea, PropertiesArea, TodoEditBox, TodoInputMain, TodoTextArea, TodoButtonAction, TodoButtonMainCreate, TodoButtonTextAction, PrioritiesWrapper, TodoInfoText, TodoButtonToggle, PropertiesWrapper, TodoDescriptionButton } from "./TodoComponents"
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
    
    const handleCreateTask = (d) => {
        // Create Task on Fauna
        createTodo(d)
            .then((task) => {
                // Add to local list
                addTaskToList(task)
            })
            .catch((err) => d.setMessage("Please try again"))
    }

    // Add a new task to the end of the list
    const addTaskToList = (task) => {
        setEntries([...entries, task])
        handleHideCreate()
    }

    // Update the createVisible state if the expanded prop changes
    useEffect(() => {
        setCreateVisible(expanded)
    }, [expanded])

    return (<>
        {!createVisible && <TodoButtonMainCreate onClick={handleShowCreate} >Create a Task</TodoButtonMainCreate>}
        {createVisible && <EditTodo className="outside" saveTodo={handleCreateTask} cancelCallback={handleHideCreate} />}
    </>)
}


// Form to create / edit a task
export function EditTodo({ current, saveTodo, className, cancelCallback }) {
    // If current task is not provided, set it to an empty object to apply default state
    current = current || {}
    let currentDue
    if (current.due !== undefined) currentDue = new Date(current.due)

    const [title, setTitle] = useState(current.title || "")
    const [description, setDiscription] = useState(current.descr || "")
    const [due, setDue] = useState(currentDue || null)
    const [priority, setPriority] = useState(current.priority || 0)
    const [saveText, setSaveText] = useState(cancelCallback ? "Cancel" : "Save")

    // Handles saving the task
    const handleSave = () => {
        // If no title is specified, do nothing
        if (title === "") {
            if (cancelCallback) cancelCallback()
            return
        }

        setSaveText("Saving…")
        if (priority === 0) setPriority(1)
        // Convert the due date to string
        const dueString = due ? due.getTime() : ""

        // Let the provided callback handle creating or updating the task
        saveTodo({
            setMessage: setSaveText,
            title: title,
            descr: description,
            due: dueString,
            priority: priority,
            checked: current.checked || false
        })
    }

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === "Enter") handleSave()
    }
    const handleSetTitle = ({ target }) => setTitle(target.value)

    return (
        <TodoEditBox className={className}>
            <ContentArea>
                <TodoInputMain placeholder="Title" value={title} onChange={handleSetTitle} onKeyDown={handleKeyDown} />
                <CollapsibleTextArea description={description} setDescription={setDiscription} onKeyDown={handleKeyDown} />
            </ContentArea>
            <PropertiesArea>
                <PropertiesWrapper>
                    <CalendarButton date={due} setDate={setDue} />
                    <PrioritySelection priority={priority} setPriority={setPriority} />
                </PropertiesWrapper>
                <TodoButtonAction onClick={handleSave} className={title !== "" ? "active" : cancelCallback ? "secondary" : ""}>{saveText}</TodoButtonAction>
            </PropertiesArea>
        </TodoEditBox>
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
        <TodoButtonTextAction onClick={showCalendar} >{buttonText}</TodoButtonTextAction>
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
    const [descriptionVisible, setDiscriptionVisible] = useState(description !== "")

    const handleSetDescription = ({ target }) => setDescription(target.value)
    const handleShowDescription = () => setDiscriptionVisible(true)

    return (<>
        {!descriptionVisible && <TodoDescriptionButton onClick={handleShowDescription} >Add a Description</TodoDescriptionButton>}
        {descriptionVisible && <TodoTextArea placeholder="Task Description" value={description}
            onChange={handleSetDescription} className={descriptionVisible ? "" : "hidden"}
            onKeyDown={onKeyDown} />}
    </>)
}