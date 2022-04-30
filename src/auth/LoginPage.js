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

    const handleLogin = () => {
        login(email, password)
    }

    const handleSetEmail = ({ target }) => { setEmail(target.value) }
    const handleSetPassword = ({ target }) => { setPassword(target.value) }

    const buttonActive = email !== "" && password !== "";

    return (
        <AuthBoxWrapper>
            <AuthBox>
                <AuthTitle> Welcome back!</AuthTitle>
                <AuthInput placeholder="Your Username" value={email} onChange={handleSetEmail} />
                <AuthInput placeholder="Your Password" value={password} onChange={handleSetPassword} />
                <AuthButton onClick={handleLogin} className={buttonActive ? "active" : ""}>Login</AuthButton>
                <AuthInfoText>Don't have an account yet? <a href="/register">Create one now!</a></AuthInfoText>
            </AuthBox>
        </AuthBoxWrapper>
    )
}