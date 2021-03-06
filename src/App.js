import { Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./auth/LoginPage"
import { RegisterPage } from "./auth/RegisterPage"
import { LogoutPage } from "./auth/LogoutPage"
import { useState, useEffect } from "react"
import { getTodos, getTodosByChecked } from "./faunaDb"
import { Header, HeaderIcon, HeaderIconContainer, HeaderTitlePersonalized } from "./header/HeaderComponents"
import { clearSession, getSecret } from "./auth/faunaAuth"
import { TodosList } from "./todos/TodoList"
import { CreateTodoButton } from "./todos/EditTodo"
import { TodoPlaceHolderInfoText, TodosWrapper } from "./todos/TodoComponents"
import { BaseInfoText } from "./baseComponents/InputBaseComponents"

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
  const [entriesUnchecked, setEntriesUnchecked] = useState([])
  const [entriesChecked, setEntriesChecked] = useState([])
  const navigate = useNavigate()

  // Redirect to login if no access token is stored
  if (getSecret() === null) navigate("/login")

  useEffect(() => {
    const handleError = (err) => {
      // If todos could not be loaded because the user is unathorized,
      // remove the local access token and navigate to login
      if (err.name === "Unauthorized" || err.name === "PermissionDenied") {
        clearSession()
        navigate("/login")
      }
    }

    // Collect the user's entries from Fauna
    // Unchecked entries
    getTodosByChecked(false)
      .then((res) => setEntriesUnchecked(res))
      .catch((err) => handleError(err))
    // Checked entries 
    getTodosByChecked(true)
      .then((res) => setEntriesChecked(res))
      .catch((err) => handleError(err))
  }, [navigate])

  return (
    <div className="App">
      <Header>
        <HeaderTitlePersonalized />
        <HeaderIconContainer>
          <HeaderIcon type="user" navto="/user" tooltip="Account" />
          <HeaderIcon type="logout" navto="/logout" tooltip="Logout" />
        </HeaderIconContainer>
      </Header>
      <CreateTodoButton entries={entriesUnchecked} setEntries={setEntriesUnchecked} expanded={entriesUnchecked.length === 0} />
      <TodosWrapper>
        <div id="unchecked">
          <TodosList todos={entriesUnchecked} setTodos={setEntriesUnchecked} others={entriesChecked} setOthers={setEntriesChecked} />
        </div>
        <div id="checked">
          {entriesChecked.length === 0 && entriesUnchecked.length !== 0 &&
            <TodoPlaceHolderInfoText className="hidden-mobile">Your completed tasks will show up here</TodoPlaceHolderInfoText>}
          <TodosList todos={entriesChecked} setTodos={setEntriesChecked} others={entriesUnchecked} setOthers={setEntriesUnchecked} />
        </div>
      </TodosWrapper>
    </div>
  );
}

export default RoutingWrapper
