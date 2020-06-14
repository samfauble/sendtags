import React, {useState, useReducer, useEffect} from 'react'
import { matcher } from "./helpers/matcher"
import { checkSendTo } from "./helpers/sendToChecker"
import PropTypes from "prop-types"
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
    const [andOrError, updateAndOrError] = useState(null)

    const errorDomChange = (error, errorName) => {
        if(error) {
            document.getElementById(errorName).setAttribute('style', 'border: 3px solid red')
        } else {
            document.getElementById(errorName).removeAttribute('style')
        }
    }

    useEffect(() => {
        errorDomChange(tagsError, 'tags')
        errorDomChange(configError, 'config')
        errorDomChange(sendToError, 'sendTo')
        errorDomChange(andOrError, 'sendType')
    }, ([tagsError, configError, sendToError, andOrError]))

    const handleChange = (event) => {
        const value = event.target.value
        const type = event.target.name
        dispatch({type, value})
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        //set updateSent to "false"
        updateSent(false)
        //validate JSON schema
        const errList = validateJson(state, updateTagsError,updateConfigError, updateSendToError, updateAndOrError)
        for(let item in errList){
            if(errList[item] !== undefined && errList[item] !== null){
                return;
            }
        }
        //get all state slices
        const { tags, config, sendTo, sendType } = state
        //parse state slices
        const parsedTags = tags.split(",")
        const parsedConfig = JSON.parse(config)
        const parsedSendTo = sendTo.split(",")
        //make sure sendTo elements are also in "tags"
        try{
            checkSendTo(parsedTags, parsedSendTo) 
        } catch(err) {
            updateSendToError(err.message)
            return;
        }
        updateSendToError(null)
        //determine AND or OR
        //match config tags with sendTo tags (if match, append to recipients)
        const recipientList = matcher(sendType, parsedSendTo, parsedConfig)
        console.log(recipientList)
        updateRecipients(recipientList)
        //once finished, updateSent to "true"
        updateSent(true)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <div>
                        <span style={{paddingRight: "10px"}}>Tags (separated by commas):</span>
                        <input id="tags" type="text" name="tags" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}} 
                              dangerouslySetInnerHTML={{__html: 'People Configs (e.g. {“Spiderman”: [“hero”, “tough”, “smart”, “tall”]}): '}}>
                        </span>
                        <input id="config" type="text" name="config" style={{width: '500px'}} onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>Send To:</span>
                        <input  id="sendTo" type="text" name="sendTo" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>AND/OR?: </span>
                        <input id="sendType" type="text" name="sendType" onChange={handleChange}/>
                    </div>
                </label>
                <input type="submit" value="Send Messages" />
            </form>
            { tagsError && <div> Error: {tagsError} </div> }
            { configError && <div> Error: {configError} </div> }
            { sendToError && <div> Error: {sendToError} </div> }
            { andOrError && <div> Error: {andOrError} </div> }
            { sent && <div>Sent to: {recipients}</div> }
        </div>
    )
}

SendTags.propTypes = {
    state: PropTypes.object,
    recipients: PropTypes.array,
    sendToError: PropTypes.oneOf([String, null]),
    sent: PropTypes.bool
}