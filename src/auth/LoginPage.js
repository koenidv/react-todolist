import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthBox, AuthBoxWrapper, AuthButton, AuthInfoText, AuthInput, AuthTitle } from "./AuthComponents"
import { clearSession, getSecret, login, saveToSession, testSecret } from "./faunaAuth"

export function LoginPage() {
    const navigate = useNavigate()
    
    // If there is already an access token stored, check if it is valid
    // If so, redirect to main page
    // If there is an error (unauthed, network, ...) delete the stored token
    useEffect(() => {
        if (getSecret() !== null) {
            testSecret()
            .then((res) => navigate("/"))
            .catch((err) => {
                console.error(err)
                clearSession()
            })
        }
    }, [navigate])

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
                <AuthInput type="name" placeholder="Your Username" value={email} onChange={handleSetEmail} />
                <AuthInput type="password" placeholder="Your Password" value={password} onChange={handleSetPassword} onKeyDown={handleKeyDown} />
                <AuthButton onClick={handleLogin} className={buttonActive ? "active" : ""}>Login</AuthButton>
                <AuthInfoText>Don't have an account yet? <a href="/register">Create one now!</a></AuthInfoText>
            </AuthBox>
        </AuthBoxWrapper>
    )
}