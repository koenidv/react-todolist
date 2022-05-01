import { Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./auth/LoginPage"
import { RegisterPage } from "./auth/RegisterPage"
import { LogoutPage } from "./auth/LogoutPage"
import { useState, useEffect } from "react"
import { createTodo, getTodos } from "./faunaDb"
import { Header, HeaderIcon, HeaderIconContainer, HeaderTitlePersonalized } from "./header/HeaderComponents"
import { clearSession, getSecret } from "./auth/faunaAuth"
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
  const navigate = useNavigate()

  // Redirect to login if no access token is stored
  if (getSecret() === null) navigate("/login")

  useEffect(() => {
    // Collect the user's entries from Fauna
    getTodos()
      .then((res) => {
        setEntries(res)
        console.log(res)
      })
      .catch((err) => {
        // If todos could not be loaded because the user is unathorized,
        // remove the local access token and navigate to login
        if (err.name === "Unauthorized" || err.name === "PermissionDenied") {
          clearSession()
          navigate("/login")
        }
      })

  }, [navigate])

  return (
    <div className="App">
      <Header>
        <HeaderTitlePersonalized />
        <HeaderIconContainer>
          <HeaderIcon type="logout" navto="/logout" tooltip="Logout" />
        </HeaderIconContainer>
      </Header>
      <CreateTodoButton entries={entries} setEntries={setEntries} expanded={entries.length === 0} />
      <TodosList todos={entries} setTodos={setEntries} />
    </div>
  );
}

export default RoutingWrapper
