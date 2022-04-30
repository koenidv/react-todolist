import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { useState } from 'react';
import { BaseInput } from './BaseComponents/InputBaseComponents';
import { createTodo } from './faunaDb';

function RoutingWrapper() {
  return (
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )

}

function App() {
  // Use state to update the UI once todo entries are loaded
  const [entries, setEntries] = useState([])
  const [input, setInput] = useState("")


  // If no user secret is saved in session storage, redirect to login page
  if (sessionStorage.getItem("secret") === null)
    return (<Navigate replace to="/login" />)

  const handleSetInput = ({target}) => { setInput(target.value) }
  const handleKeyDown = (e) => {if (e.key === "Enter") createTodo(input)}
  

  return (
    <div className="App">
      Todolist App for SE_19 <br />
      <a href="/login">Login</a> or <a href="/register">Register</a>
      <BaseInput value={input} onChange={handleSetInput} onKeyDown={handleKeyDown} />
    </div>
  );
}

export default RoutingWrapper
