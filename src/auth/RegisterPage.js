import { useState } from "react"
import { AuthBox, AuthBoxWrapper, AuthButton, AuthInfoText, AuthInput, AuthTitle } from "./AuthComponents"
import { createUser } from "./faunaAuth"

export function RegisterPage() {

    return (<RegisterWrapper />)
}

function RegisterWrapper() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [message, setMessage] = useState("")

    const handleCreateUser = () => {
        // Check if a username is specified and the passwords match up
        if (email === "") {
            setMessage("Please choose a username")
            return
        }
        if (password !== passwordConfirm) {
            setMessage("Make sure you didn't mistype your password")
            return
        }

        // Create a new user with the specified username/email and password
        createUser(email, password)
        .then((res) => {console.log(res)})
        .catch((err) => setMessage("An error occurred: " + err.toString()))
    }

    const handleSetEmail = ({ target }) => { setEmail(target.value) }
    const handleSetPassword = ({ target }) => { setPassword(target.value) }
    const handleSetPasswordConfirm = ({ target }) => { setPasswordConfirm(target.value) }

    const buttonActive = email !== "" && password !== "" && passwordConfirm !== "";

    return (
        <AuthBoxWrapper>
            <AuthBox>
                <AuthTitle> Create an Account</AuthTitle>
                <AuthInfoText className="warning">{message}</AuthInfoText>
                <AuthInput placeholder="Choose a Username" value={email} onChange={handleSetEmail} />
                <AuthInput placeholder="Choose a Password" value={password} onChange={handleSetPassword} />
                <AuthInput placeholder="Repeat your Password" value={passwordConfirm} onChange={handleSetPasswordConfirm} />
                <AuthButton onClick={handleCreateUser} className={buttonActive ? "active" : ""}>Create your Account</AuthButton>
                <AuthInfoText>Already have an account? <a href="/login">Go to Login</a></AuthInfoText>
            </AuthBox>
        </AuthBoxWrapper>
    )

}