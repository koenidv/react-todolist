import logo from './logo.svg'
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';

function RoutingWrapper() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )

}

function App() {
  return (
    <div className="App">
      Todolist App for SE_19 <br/>
      <a href="/login">Login</a> or <a href="/register">Register</a>
    </div>
  );
}

export default RoutingWrapper
