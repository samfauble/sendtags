import React, {useState, useReducer} from 'react'

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
    const [recipients, updateRecipients] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        const value = event.target.value
        const type = event.target.name
        dispatch({type, value})
    }
    
    const listConfigPeople = (config) => {
        const list = []
        for(let person in config) {
            list.push(person)
        }
        return list
    }

    const andMatcher = (config, sendTo) => {
        const list = listConfigPeople(config)
        const returnList = list.filter((person) => {
            const attributes = config[person]
            for(let i = 0; i <= sendTo.length-1; i++) {
                const tag = sendTo[i]
                console.log(attributes.includes(tag), tag)
                if (attributes.includes(tag)) {
                    continue;
                } else {
                    return false
                } 
            }
            return true
        })
        return returnList;
    }

    const orMatcher = (config, sendTo) => {
        const list = listConfigPeople(config)
        const returnList = list.filter((person) => {
            const attributes = config[person]
            for(let i = 0; i <= sendTo.length-1; i++) {
                const tag = sendTo[i] 
                if (attributes.includes(tag)) {
                    return true
                }
            }
            return false
        })

        return returnList
    }
    
    const matcherHelper = (sendType, sendTo, config) => {
        if(sendType === 'OR') {
            return orMatcher(config, sendTo)
        } else if (sendType === 'AND') {
            return andMatcher(config, sendTo)
        } else {
            throw new Error("invalid sendType received. Use AND or OR.")
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        //set updateSent to "false"
        updateSent(false)
        //validate JSON schema
        //get all state slices
        const { tags, config, sendTo, sendType } = state
        //parse state slices
        const parsedTags = tags.split(", ")
        const parsedConfig = JSON.parse(config)
        const parsedSendTo = sendTo.split(", ")
        //make sure sendTo elements are also in "tags"
        for (let item in parsedSendTo) {
            if (item in parsedTags) {
                continue
            } else {
                throw new Error("sendTo tag not found in Tags")
            }
        }
        //determine AND or OR
        //match config tags with sendTo tags (if match, append to recipients)
        const recipientList = matcherHelper(sendType, parsedSendTo, parsedConfig)
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
            { sent && <div>Sent to: {recipients}</div> }
        </div>
    )
}