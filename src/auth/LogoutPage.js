import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { clearSession, logout } from "./faunaAuth"

// Logs the user out and removes the access token and userRef from session storage
export function LogoutPage() {
    const navigate = useNavigate()


    useEffect(() => {
        const onLoggedOut = () => {
            clearSession()
            navigate("/login")
        }

        logout()
            .then((res) => {
                onLoggedOut()
            })
            .catch((err) => {
                if (err.name === "Unauthorized" || err.name === "PermissionDenied") {
                    onLoggedOut()
                }
                console.error(err)
            })
    }, [navigate])

    return <></>
}