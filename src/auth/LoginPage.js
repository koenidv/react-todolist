import { useState } from "react"
import { BaseButton, BaseInput } from "../BaseComponents/InputBaseComponents"
import { AuthBox, AuthBoxWrapper, AuthButton, AuthInfoText, AuthInput, AuthTitle } from "./AuthComponents"
import { login } from "./faunaAuth"

export function LoginPage() {
    return (<LoginWrapper />)
}

function LoginWrapper() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleLogin = () => {
        login(email, password)
        .then((secret) => {
            alert("Login successful! Token is " + secret)
            sessionStorage.setItem("secret", secret)
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