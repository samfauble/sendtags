import React, {useState, useReducer, useEffect} from 'react'
import PropTypes from "prop-types"
import { Button, Container, Input } from "@material-ui/core"

import { matcher } from "./helpers/matcher"
import { validateJson } from './helpers/validateJson'

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

    const errorDomChange = (error, errorName, alignment) => {
        console.log(error, errorName)
        if(error) {
            document.getElementById(errorName).setAttribute('style', 'border: 3px solid red')
        } else {
            document.getElementById(errorName).removeAttribute('style')
        }
    }



    useEffect(() => {
        errorDomChange(tagsError, 'tags', false)
        errorDomChange(configError, 'config', false)
        errorDomChange(andOrError, 'sendType', false)
        errorDomChange(sendToError, 'sendTo', false)
        errorDomChange(tagAlignmentError, 'align', true)
        
    }, ([tagsError, configError, sendToError, andOrError, tagAlignmentError]))

    const handleChange = (event) => {
        const value = event.target.value
        const type = event.target.name
        dispatch({type, value})
    }

    const handleErrList = (errList) => {
        for(let item in errList){
            if(errList[item] !== undefined && errList[item] !== null){
                return false;
            }
        }
        return true
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        //set updateSent to "false"
        updateSent(false)
        //validate JSON schema
        const errList = validateJson(state, updateTagsError,updateConfigError, updateSendToError, updateAndOrError, updateTagAlignmentError)
        const canContinue = handleErrList(errList)
        if(canContinue === false) { return; }
        //get all state slices
        const { config, sendTo, sendType } = state
        //parse state slices
        const parsedConfig = JSON.parse(config)
        const parsedSendTo = sendTo.split(",")
        //match config tags with sendTo tags (if match, append to recipients)
        const recipientList = matcher(sendType, parsedSendTo, parsedConfig)
        updateRecipients(recipientList)
        //once finished, updateSent to "true"
        updateSent(true)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <Container>
                        <span style={{paddingRight: "10px"}}>Tags (separated by commas):</span>
                        <Input variant="filled" style={{backgroundColor: "#E2E2E2"}} id="tags" type="text" name="tags" onChange={handleChange}/>
                    </Container>
                    <Container>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}} 
                              dangerouslySetInnerHTML={{__html: 'People Configs (e.g. {“Spiderman”: [“hero”, “tough”, “smart”, “tall”]}): '}}>
                        </span>
                        <Input variant="filled" id="config" type="text" name="config" style={{width: '500px', backgroundColor: "#E2E2E2"}} onChange={handleChange}/>
                    </Container>
                    <Container id= "align">
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>Send To:</span>
                        <Input variant="filled" style={{backgroundColor: "#E2E2E2"}} id="sendTo" type="text" name="sendTo" onChange={handleChange}/>
                    </Container>
                    <Container>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>AND/OR?: </span>
                        <Input variant="filled" style={{backgroundColor: "#E2E2E2"}} id="sendType" type="text" name="sendType" onChange={handleChange}/>
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
            { sent && <div className="success">Sent to: 
                    {"  " + recipients[0] + recipients.slice(1).map((person) => {
                        return ",   " + person
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
    sent: PropTypes.bool
}