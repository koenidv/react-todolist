import styled from "styled-components"
import { BaseInput, BaseButton, BaseTitle } from "../BaseComponents/InputBaseComponents"

export const AuthBoxWrapper = styled.div`
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
`

export const AuthBox = styled.div`
    border: 1px solid #ffffff;
    max-width: 48rem;
`

export const AuthTitle = styled(BaseTitle)`
    width: 100%;
    margin: 4rem 0 4rem 0;
    text-align: center;
`

export const AuthInput = styled(BaseInput)`
    width: calc(100% - 4rem);
    margin: 0 2rem 1rem 2rem;
    text-align: center;
`

export const AuthButton = styled(BaseButton)`
    width: calc(100% - 4rem);
    margin: 1rem 2rem 0 2rem;
    text-align: center;
    background-color: #101010;
    border: none;

    &:hover {
        background-color: #161616;
    }

    &.active {
        background-color: #6a459f;

        &:hover {
            background-color: #7857a8;
        }
    }
`

export const AuthInfoText = styled.p`
    text-align: center;
    margin: 2rem 2rem;

    &.warning {
        color: #6a459f;
    }
`