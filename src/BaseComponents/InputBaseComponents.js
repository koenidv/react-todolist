import styled from "styled-components"

export const BaseTitle = styled.h1``

export const BaseInput = styled.input`
    background-color: transparent;
    border: 1px solid #aaaaaa;
    padding: 1rem;
    font-size: 1rem;
    color: #ffffff;
    border-radius: 0;
    box-sizing: border-box;
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
    transition: border-radius 100ms, border-color 100ms, background-color 150ms ease-out;
    user-select: none;

    &:hover, &:active, &:focus {
        border-radius: 4px;
        border-color: #ffffff;
        background-color: #101010;
    }`