import styled from "styled-components"
import { BaseInput, BaseTitle, BaseButtonAction } from "../baseComponents/InputBaseComponents"

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

export const AuthButton = styled(BaseButtonAction)`
    width: calc(100% - 4rem);
    margin: 1rem 2rem 0 2rem;
`

export const AuthInfoText = styled.p`
    text-align: center;
    margin: 2rem 2rem;

    &.warning {
        color: #6a459f;
    }
`