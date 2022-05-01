import styled from "styled-components"
import { BaseInput, BaseInputBorderless, BaseTextArea } from "../baseComponents/InputBaseComponents"

export const TodoBox = styled.div`
    display: grid;
    grid-template-columns: [content] 2fr [props] 1fr;
    border: 1px solid #ffffff;
    padding: 1rem;
    margin: 0 2rem 1rem 2rem
`

export const ContentArea = styled.div`
    grid-area: content;
    padding-right: 1rem;
`

export const PropertiesArea = styled.div`
    grid-area: props;
    border-left: 1px solid #ffffff;
    padding-left: 1rem;
`

export const TodoInputMain = styled(BaseInputBorderless)`
    width: 100%;
    border-bottom: 1px solid #ffffff;
    margin-bottom: 1rem;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    transition: background-color 150ms ease-out;

    &:active, &:focus {
        background-color: #161616;
    }
`

export const TodoTextArea = styled(BaseTextArea)`
    width: 100%;
    margin-bottom: 1rem;
    height: 8rem;
    min-height: 6rem;
`