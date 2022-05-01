import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthBox, AuthBoxWrapper, AuthButton, AuthInfoText, AuthInput, AuthTitle } from "./AuthComponents"
import { clearSession, createUser, getSecret, saveToSession, testSecret } from "./faunaAuth"

export function RegisterPage() {
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
            <RegisterWrapper />)
        </div>
    )
}

function RegisterWrapper() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate("/")

    //Checks if the inputs are valid and creates a new user
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
            .then((res) => {
                saveToSession(res)
                navigate("/")
                
            })
            .catch((err) => {
                setMessage("An error occurred. Please try again later.")
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCreateUser()
        }
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
                <AuthInput placeholder="Repeat your Password" value={passwordConfirm}
                    onChange={handleSetPasswordConfirm} onKeyDown={handleKeyDown} />
                <AuthButton onClick={handleCreateUser} className={buttonActive ? "active" : ""}>Create your Account</AuthButton>
                <AuthInfoText>Already have an account? <a href="/login">Go to Login</a></AuthInfoText>
            </AuthBox>
        </AuthBoxWrapper>
    )

}