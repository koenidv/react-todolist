import { Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./auth/LoginPage"
import { RegisterPage } from "./auth/RegisterPage"
import { LogoutPage } from "./auth/LogoutPage"
import { useState, useEffect } from "react"
import { createTodo, getTodos } from "./faunaDb"
import { Header, HeaderIcon, HeaderIconContainer, HeaderTitlePersonalized } from "./header/HeaderComponents"
import { clearSession } from "./auth/faunaAuth"
import { TodosList } from "./todos/TodoList"
import { CreateTodoButton, EditTodo } from "./todos/EditTodo"

function RoutingWrapper() {
  return (
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  )

}

function App() {
  // Use state to update the UI once todo entries are loaded
  const [entries, setEntries] = useState([])
  const [input, setInput] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Collect the user's entries from Fauna
    getTodos()
      .then((res) => {
        setEntries(res)
      })
      .catch((err) => {
        if (err.name === "Unauthorized" || err.name === "PermissionDenied") {
          clearSession()
          navigate("/login")
        }
      })

  }, [navigate])

  const addTask = (task) => {
    console.log(entries)
    setEntries([...entries, task])
    console.log(entries)
  }

  return (
    <div className="App">
      <Header>
        <HeaderTitlePersonalized />
        <HeaderIconContainer>
          <HeaderIcon type="logout" navto="/logout" tooltip="Logout" />
        </HeaderIconContainer>
      </Header>
      <CreateTodoButton entries={entries} setEntries={setEntries} expanded={entries.length === 0} />
      <TodosList todos={entries} />
    </div>
  );
}

export default RoutingWrapper
