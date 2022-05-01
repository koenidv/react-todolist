import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "./faunaAuth"

// Logs the user out and removes the access token and userRef from session storage
export function LogoutPage() {
    const navigate = useNavigate()
    useEffect(() => {
        logout()
            .then((res) => {
                sessionStorage.removeItem("secret")
                sessionStorage.removeItem("userId")
                navigate("/")
            })
            .catch((err) => {
                if (err.name === "Unauthorized" || err.name === "PermissionDenied") {
                    sessionStorage.removeItem("secret")
                    sessionStorage.removeItem("userRef")
                    navigate("/")
                }
                console.error(err)
            })
    }, [])

    return <></>
}