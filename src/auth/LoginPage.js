import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthBox, AuthBoxWrapper, AuthButton, AuthInfoText, AuthInput, AuthTitle } from "./AuthComponents"
import { login, saveToSession } from "./faunaAuth"

export function LoginPage() {
    return (
        <div className="app">
            <LoginWrapper />)
        </div>
    )
}

function LoginWrapper() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleLogin = () => {
        login(email, password)
            .then((res) => {
                saveToSession(res)
                navigate("/")
            })
            .catch((err) => {
                if (err.message === "authentication failed")
                    setMessage("Please check your username and password and try again.")
                else {
                    setMessage("An error occured. Please try again later.")
                    console.log(err)
                }
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin()
        }
    }

    const handleSetEmail = ({ target }) => { setEmail(target.value) }
    const handleSetPassword = ({ target }) => { setPassword(target.value) }

    const buttonActive = email !== "" && password !== "";

    return (
        <AuthBoxWrapper>
            <AuthBox>
                <AuthTitle> Welcome back!</AuthTitle>
                <AuthInfoText className="warning">{message}</AuthInfoText>
                <AuthInput placeholder="Your Username" value={email} onChange={handleSetEmail} />
                <AuthInput placeholder="Your Password" value={password} onChange={handleSetPassword} onKeyDown={handleKeyDown} />
                <AuthButton onClick={handleLogin} className={buttonActive ? "active" : ""}>Login</AuthButton>
                <AuthInfoText>Don't have an account yet? <a href="/register">Create one now!</a></AuthInfoText>
            </AuthBox>
        </AuthBoxWrapper>
    )
}