import React, {useState, useReducer} from 'react'

function changeReducer(state={}, action) {
    const value = action.value
    switch(action.type) {
        case "tags":
            return {
                ...state,
                tags: [value]
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
    const [recipients, updateRecipients] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        const value = event.target.value
        const type = event.target.name
        dispatch({type, value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        /*  implement me
            hint: we will probably need to update state here to render the right parts
        */
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
            { sent && <div>Sent to: {recipients}</div> }
        </div>
    )
}