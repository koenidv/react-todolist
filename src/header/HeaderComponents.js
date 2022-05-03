import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useState } from "react"
import { useEffect } from "react"
import imgLogout from "../assets/logout.svg"

export const Header = styled.header`
    width: calc(100vw - 2rem);
    margin: 1rem 1rem 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const HeaderBaseTitle = styled.h2`
    margin: 0;
    transition: color 100ms ease-out;
    user-select: none;
`

const HeaderBaseIcon = styled.img`
    height: 100%;
    max-width: 2rem;
    transition: filter 100ms ease-out;

    &:hover {
        // This "color filter" transforms the icon color to #6a459f
        // Created using this Codepen: https://codepen.io/sosuke/pen/Pjoqqp
        filter: brightness(0) saturate(100%) invert(30%) sepia(52%) saturate(1276%) hue-rotate(233deg) brightness(83%) contrast(84%);
        cursor: pointer;
    }
`

export const HeaderIconContainer = styled.div`
    height: 1.5rem;
`

export function HeaderTitleApp() {
    const navigate = useNavigate()

    const handleNavigationClick = () => {
        navigate("/")
    }

    return <HeaderBaseTitle onClick={handleNavigationClick}>todolist</HeaderBaseTitle>
}

export function HeaderTitlePersonalized() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    // Retreive user name from session storage
    useEffect(() => {
        setEmail(sessionStorage.getItem("email"))
    }, [])

    const handleNavigationClick = () => {
        navigate("/")
    }

    return (
        <HeaderBaseTitle onClick={handleNavigationClick}>
            todolist | Hey {email}
        </HeaderBaseTitle>
    )
}

export function HeaderIcon({ type, navto, tooltip }) {
    const navigate = useNavigate()
    let icon;

    switch (type) {
        case "logout":
            icon = imgLogout
            break
        default:
            break
    }

    const handleClick = () => {
        navigate(navto)
    }

    // If an invalid type was specified, throw an error and return
    if (icon === null) {
        throw new Error("Invalid Type was specified for HeaderIcon")
    }

    return <HeaderBaseIcon src={imgLogout} onClick={handleClick} title={tooltip} />
}