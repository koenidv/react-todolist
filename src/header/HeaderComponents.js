import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { BaseButtonBorderless, BaseInfoText } from "../baseComponents/InputBaseComponents"
import imgLogout from "../assets/logout.svg"
import imgUser from "../assets/user.svg"

export const Header = styled.header`
    width: calc(100% - 2rem);
    margin: 1rem 1rem 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 64rem) {
        margin-bottom: 1rem;
    }

    @media screen and (max-width: 40rem) {
        margin-bottom: 0.5rem;
    }
`

const HeaderBaseTitle = styled.h2`
    margin: 0;
    font-size: 1.5rem;
    transition: color 100ms ease-out;
    user-select: none;
`

const HeaderIconButton = styled(BaseButtonBorderless)`
    display: flex;
    height: 100%;
    padding: 0.25rem;
    align-items: center;
`

const HeaderIconButtonText = styled(BaseInfoText)`
    margin-left: 0.5rem;

    @media screen and (max-width: 40rem) {
        display: none;
    }
`

const HeaderBaseIcon = styled.img`
    height: 1.5rem;
    max-width: 2rem;
`

export const HeaderIconContainer = styled.div`
    display: flex;
    height: 2.25rem;

    >* {
        margin-left: 0.5rem;
    }
`

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
            todolist<span className="hidden-mobile"> | Hey {email}</span>
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
        case "user":
            icon = imgUser
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

    return (
        <HeaderIconButton onClick={handleClick}>
            <HeaderBaseIcon src={icon} title={tooltip} />
            <HeaderIconButtonText>{tooltip}</HeaderIconButtonText>
        </HeaderIconButton>
    )
}