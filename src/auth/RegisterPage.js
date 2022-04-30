import { useState } from "react"
import { BaseButton, BaseInput } from "../BaseComponents/InputBaseComponents"
import { createUser } from "./faunaAuth"

export function RegisterPage() {

    return (<RegisterWrapper />)
}

function RegisterWrapper() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const handleCreateUser = () => {
        if (password === passwordConfirm)
            createUser(email, password)
        else console.log("Passwords are different")
    }

    const handleSetEmail = ({ target }) => { setEmail(target.value) }
    const handleSetPassword = ({ target }) => { setPassword(target.value) }
    const handleSetPasswordConfirm = ({ target }) => { setPasswordConfirm(target.value) }

    return (
        <>
            <BaseInput placeholder="email" value={email} onChange={handleSetEmail} />
            <BaseInput placeholder="password" value={password} onChange={handleSetPassword} />
            <BaseInput placeholder="password_repeat" value={passwordConfirm} onChange={handleSetPasswordConfirm} />
            <BaseButton onClick={handleCreateUser}>Create User</BaseButton>
        </>
    )

}