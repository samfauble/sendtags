import React, {useState, useReducer, useEffect} from 'react'
import PropTypes from "prop-types"
import { Button, Container, Input } from "@material-ui/core"

import { matcher } from "./helpers/matcher"
import { validateInput } from './helpers/validateInput'

//The reducer that handles state and state changes onChange
function changeReducer(state={}, action) {
    const value = action.value
    switch(action.type) {
        case "tags":
            return {
                ...state,
                tags: value
            }
        case "config":
            return {
                ...state,
                config: value
            }
        case "sendTo":
            return {
                ...state,
                sendTo: value
            }
        case "sendType":
            return {
                ...state,
                sendType: value
            }
        default:
            return state;
    }
}

export default function SendTags () {
    const [state, dispatch] = useReducer(changeReducer, {});
    
    const [recipients, updateRecipients] = useState([])
    const [sent, updateSent] = useState(false)
    const [tagsError, updateTagsError] = useState(null)
    const [configError, updateConfigError] = useState(null)
    const [sendToError, updateSendToError] = useState(null)
    const [tagAlignmentError, updateTagAlignmentError] = useState(null)
    const [andOrError, updateAndOrError] = useState(null)

    //Manipulates DOM changes for errors
    const errorDomChange = (error, errorName) => {
        if(error) {
            document.getElementById(errorName).setAttribute('style', 'border: 3px solid red')
        } else {
            document.getElementById(errorName).removeAttribute('style')
        }
    }

    //Handles all UI error changes
    useEffect(() => {
        errorDomChange(tagsError, 'tags')
        errorDomChange(configError, 'config')
        errorDomChange(andOrError, 'sendType')
        errorDomChange(sendToError, 'sendTo')
        errorDomChange(tagAlignmentError, 'align')
        
    }, ([tagsError, configError, sendToError, andOrError, tagAlignmentError]))

    //Dispatches reducer on change
    const handleChange = (event) => {
        const value = event.target.value
        const type = event.target.name
        dispatch({type, value})
    }

    // Return true if the error list returned by 
    // validateInput contains only undefined or null values
    const handleErrList = (errList) => {
        for(let item in errList){
            if(errList[item] !== undefined && errList[item] !== null){
                return false;
            }
        }
        return true
    }

    //Updates sent state and recipients state
    const handleSubmit = (event) => {
        event.preventDefault()
        updateSent(false)

        //Check for input errors, 
        //end the the submit fuction if there is at least one error present
        const errList = validateInput(state, updateTagsError,updateConfigError, updateSendToError, updateAndOrError, updateTagAlignmentError)
        const canContinue = handleErrList(errList)
        if(canContinue === false) { return; }

        //Create a list of recipients
        const { config, sendTo, sendType } = state
        const parsedConfig = JSON.parse(config)
        const parsedSendTo = sendTo.split(",")
        const recipientList = matcher(sendType, parsedSendTo, parsedConfig)
        
        //Update recipient state and sent state
        updateRecipients(recipientList)
        updateSent(true)
    }

    return (
        <div>
            <form 
            onSubmit={handleSubmit} 
            style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <Container>
                        <span 
                        style={{paddingRight: "10px"}}>
                            Tags (separated by commas):
                        </span>
                        <Input 
                        variant="filled" 
                        style={{backgroundColor: "#E2E2E2"}} 
                        id="tags" 
                        type="text" 
                        name="tags" 
                        onChange={handleChange}/>
                    </Container>
                    <Container>
                        <span 
                        style={{paddingRight: "10px", paddingTop: "20px"}} 
                        dangerouslySetInnerHTML={{__html: 'People Configs (e.g. {“Spiderman”: [“hero”, “tough”, “smart”, “tall”]}): '}}>
                        </span>
                        <Input 
                        variant="filled" 
                        id="config" 
                        type="text" 
                        name="config" 
                        style={{width: '500px', backgroundColor: "#E2E2E2"}} 
                        onChange={handleChange}/>
                    </Container>
                    <Container id= "align">
                        <span 
                        style={{paddingRight: "10px", paddingTop: "20px"}}>
                            Send To:
                        </span>
                        <Input 
                        variant="filled" 
                        style={{backgroundColor: "#E2E2E2"}} 
                        id="sendTo" 
                        type="text" 
                        name="sendTo" 
                        onChange={handleChange}/>
                    </Container>
                    <Container>
                        <span 
                        style={{paddingRight: "10px", paddingTop: "20px"}}>
                            AND/OR?: 
                        </span>
                        <Input 
                        variant="filled" 
                        style={{backgroundColor: "#E2E2E2"}} 
                        id="sendType" 
                        type="text" 
                        name="sendType" 
                        onChange={handleChange}/>
                    </Container>
                </label>
                <Container>
                    <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                    disabled= {state.tags && state.config && state.sendTo && state.sendType ? false : true}>
                        Send Message
                    </Button>
                </Container>
            </form>
            <Container style={{"paddingTop": "40px"}}>
                { tagsError && <div className="error"> Error: {tagsError} </div> }
                { configError && <div className="error"> Error: {configError} </div> }
                { sendToError && <div className="error"> Error: {sendToError} </div> }
                { tagAlignmentError && <div className="error"> Error: {tagAlignmentError} </div> }
                { andOrError && <div className="error"> Error: {andOrError} </div> }
                { sent && 
                <div className="success">
                    Sent to:
                    {recipients.length === 1 ? 
                    "  " + recipients[0] : 
                    "  " + recipients[0] + "," + recipients.slice(1).map((person) => {
                        return "   " + person
                    })} 
                </div> }
            </Container>
        </div>
    )
}

SendTags.propTypes = {
    state: PropTypes.object,
    recipients: PropTypes.array,
    sendToError: PropTypes.oneOf([String, null]),
    updateTagsError: PropTypes.oneOf([String, null]), 
    configError: PropTypes.oneOf([String, null]), 
    andOrError: PropTypes.oneOf([String, null]),  
    tagAlignmentError: PropTypes.oneOf([String, null]), 
    sent: PropTypes.bool
}