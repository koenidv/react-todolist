import { useState } from "react"
import { BaseButton, BaseInput } from "../BaseComponents/InputBaseComponents"
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

    return (
        <>
            <BaseInput placeholder="email" value={email} onChange={handleSetEmail} />
            <BaseInput placeholder="password" value={password} onChange={handleSetPassword} />
            <BaseButton onClick={handleLogin}>Login</BaseButton>
        </>
    )
}