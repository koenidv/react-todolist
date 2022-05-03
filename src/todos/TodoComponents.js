import { Checkbox } from "pretty-checkbox-react"
import styled from "styled-components"
import { BaseButtonAction, BaseButtonBorderless, BaseInputBorderless, BaseTextArea } from "../baseComponents/InputBaseComponents"

// Containers

export const TodosWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 1rem;

    @media screen and (max-width: 56rem) {
        grid-template-columns: 1fr;
    }
`

export const TodoEditBox = styled.div`
    display: grid;
    grid-template-columns: [content] 2fr [props] 1fr;
    padding: 1rem;
    margin: 0 2rem 1rem 2rem;
    border: 1px solid #aeaeae;
    border-radius: 4px;
`

export const TodoBox = styled.div`
    padding: 1rem;
    margin: 0 0.75rem 0.75rem 0.75rem;
    border: 1px solid #242424;
    border-radius: 4px;
    box-sizing: border-box;
    
    &.pr-2 {
        background-color: #242424;
        border: none;
    }
    
    &.pr-3 {
        background-color: #35224f;
        border: none;
    }
`

export const TodoBoxSummary = styled.div`
    padding: 1rem;
    margin: 0 0.75rem 0.75rem 0.75rem;
    border-radius: 4px;
    border: 1px solid #242424;
    box-sizing: border-box;
    align-items: center;
    transition: background-color 100ms ease-out;

    &:hover {
        background-color: #161616;
    }

    &.pr-2 {
        background-color: #242424;
        border: none;

        &:hover {
            background-color: #2d2d2d;
        }
    }

    &.pr-3 {
        background-color: #35224f;
        border: none;

        &:hover {
            background-color: #3f295f;
        }
    }
`

export const ContentArea = styled.div`
    grid-area: content;
    padding-right: 1rem;
`

export const PropertiesArea = styled.div`
    grid-area: props;
    height: 100%;
    border-left: 1px solid #606060;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

export const TodoBody = styled.div`
    margin-left: 2.25rem;
`

export const PrioritiesWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin: 0.25rem 0rem 0 1rem;
    
    >* {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
`

export const LineWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`

export const TodoSummaryActionsWrapper = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`

// Inputs

export const TodoInputMain = styled(BaseInputBorderless)`
    width: 100%;
    display: block;
    border-bottom: 1px solid #aeaeae;
    margin-bottom: 1rem;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    transition: background-color 150ms ease-out, border-color 100ms;

    &:hover {
        border-color: #ffffff;
        background-color: #0a0a0a;
    }

    &:active, &:focus {
        background-color: #161616;
    }
`

export const TodoTextArea = styled(BaseTextArea)`
    width: 100%;
    display: block;
    margin-bottom: 1rem;
    height: 8rem;
    min-height: 6rem;
`

export const TodoCheckbox = styled(Checkbox)`
    width: 1rem
`

// Buttons

export const TodoButtonAction = styled(BaseButtonAction)`
    width: 100%;
    margin-top: 1rem;
`

export const TodoButtonTextAction = styled(BaseButtonBorderless)`
    width: 100%;
    text-align: start;
`

export const TodoButtonText = styled(BaseButtonBorderless)`
    ${TodoBox}.pr-2 & {
        &:hover {
            background-color: #161616;
        }
    }
    ${TodoBox}.pr-3 & {
        &:hover {
            background-color: #281c3e;
        }
    }
`

export const TodoButtonToggle = styled(BaseButtonBorderless)`
    width: 100%;

    &.selected {
        background-color: #6a459f;
    }
`

export const TodoButtonMainCreate = styled(BaseButtonBorderless)`
    width: calc(100% - 4rem);
    margin: 0 2rem 1rem 2rem;
`

export const TodoActionIcon = styled.img`
    height: 100%;
    max-height: 1.5rem;
    max-width: 2rem;
    margin-left: 0.5rem;
    opacity: 0;
    transition: opacity 100ms ease-out;

    ${TodoBoxSummary}:hover & {
        opacity: 0.4;

        &:hover {
            opacity: 1;
            cursor: pointer;
        }
    }
`

// Text

export const TodoInfoText = styled.p`
    color: #ffffff;
    font-size: 1rem;
    display: block;
    margin: 0.25rem 0 0.25rem 0;
`

export const TodoTitleCompact = styled.h4`
    color: #ffffff;
    margin: 0;
    padding: 0 0.75rem 0 1rem;
`

export const TodoTitle = styled.h2`
    color: #ffffff;
    margin: 0;
    padding: 0 0.75rem;
`

export const TodoText = styled.p`
    color: #ffffff;
    margin-top: 1rem;
    display: block;
`