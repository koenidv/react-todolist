import { Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./auth/LoginPage"
import { RegisterPage } from "./auth/RegisterPage"
import { useState, useEffect } from "react"
import { BaseInput } from "./BaseComponents/InputBaseComponents"
import { createTodo, getTodos } from "./faunaDb"
import { LogoutPage } from "./auth/LogoutPage"
import { Header, HeaderIcon, HeaderIconContainer, HeaderTitlePersonalized } from "./header/HeaderComponents"
import { clearSession } from "./auth/faunaAuth"

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

  const handleSetInput = ({ target }) => { setInput(target.value) }
  const handleKeyDown = (e) => { if (e.key === "Enter") createTodo(input) }

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

  }, [])

  return (
    <div className="App">
      <Header>
        <HeaderTitlePersonalized />
        <HeaderIconContainer>
          <HeaderIcon type="logout" navto="/logout" tooltip="Logout" />
        </HeaderIconContainer>
      </Header>
      <BaseInput value={input} onChange={handleSetInput} onKeyDown={handleKeyDown} />
      <TempListView entries={entries} />
    </div>
  );
}

function TempListView({ entries }) {
  let list = ""
  if (entries.length > 0) {
    list = entries.map((entry) => <li key={entry.ref.value.id}>{entry.data.title}</li>)
  }
  return list
}

export default RoutingWrapper
