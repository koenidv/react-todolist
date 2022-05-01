import styled from "styled-components"

export const BaseTitle = styled.h1``

export const BaseInputBorderless = styled.input`
    background-color: transparent;
    padding: 1rem;
    font-size: 1rem;
    color: #ffffff;
    border-radius: 0;
    border: none;
    box-sizing: border-box;
    
    &:focus-visible {
        outline: none;
    }
`

export const BaseInput = styled(BaseInputBorderless)`
    border: 1px solid #aaaaaa;
    transition: border-radius 100ms, border-color 100ms;

    &:hover, &:active, &:focus {
        border-radius: 4px;
        border-color: #ffffff;
    }
`

export const BaseTextArea = styled.textarea`
    background-color: transparent;
    padding: 1rem;
    font-size: 1rem;
    color: #ffffff;
    border-radius: 0;
    border: none;
    box-sizing: border-box;
    border: 1px solid #aaaaaa;
    resize: vertical;
    transition: border-radius 100ms, border-color 100ms;

    &:hover, &:active, &:focus {
        border-radius: 4px;
        border-color: #ffffff;
    }
`

export const BaseButton = styled.button`
    background-color: transparent;
    border: 1px solid #aaaaaa;
    padding: 1rem;
    font-size: 1rem;
    color: #ffffff;
    border-radius: 0;
    box-sizing: border-box;
    text-align: center;
    transition: border-radius 100ms, border-color 100ms, background-color 150ms ease-out;
    user-select: none;

    &:hover, &:active, &:focus {
        border-radius: 4px;
        border-color: #ffffff;
        background-color: #101010;
    }
`

export const BaseButtonAction = styled(BaseButton)`
    background-color: #161616;
    border: none;

    &:hover {
        cursor: not-allowed;
    }

    &.active {
        background-color: #6a459f;

        &:hover {
            background-color: #7857a8;
        }
    }
`