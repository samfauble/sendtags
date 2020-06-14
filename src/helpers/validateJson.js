

class ValidationError{
    
    constructor(message, id) {
        this.message = message
        this.id = id
    }
}


const tagValidation = (tags) => {
    const tagList = tags.split(",")
    for(let item in tagList){
        if(tagList[item].indexOf(" ") !== -1) {
            throw new ValidationError("Don't put spaces after commas in Tags input.", "tags")
        }
    }
}

const configValidation = (config) => {

}

const sendToValidation = (sendTo) => {
    const sendToList = sendTo.split(",")
    for(let item in sendToList){
        if(sendToList[item].indexOf(" ") !== -1) {
            throw new ValidationError("Don't put spaces after commas in sendTo input.", "sendTo")
        }
    } 
}

const sendTypeValidation = (sendType) => {
    if(sendType !== "OR" && sendType !== "AND") {
        throw new ValidationError("Enter only AND or OR.", "sendType")
    }
}

const tryCatch = (stateSlice, validator, stateUpdate) => {
    try {
        validator(stateSlice)
    } catch (e) {
        stateUpdate(`"${e.id}" is improperly formatted. ${e.message}`)
        return (e.message, e.id)
    }
    stateUpdate(null)
}

export const validateJson = (state, updateTagsError, updateConfigError, updateSendToError, updateAndOrError) => {
    const { tags, config, sendTo, sendType } = state
    const tryTag = tryCatch(tags, tagValidation, updateTagsError)
    const tryConfig = tryCatch(config, configValidation, updateConfigError)
    const trySendTo = tryCatch(sendTo, sendToValidation, updateSendToError)
    const trySendType = tryCatch(sendType, sendTypeValidation, updateAndOrError)

    const errorList = [tryTag, tryConfig, trySendTo, trySendType]
    errorList.filter((item) => {
        if(!item){
            return false
        } else {
            return true
        }
    })
    return errorList
}
