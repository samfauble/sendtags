

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

const alignmentValidation = (stateSlice) => {
    const {parsedTags, parsedSendTo} = stateSlice;
    for(let item in parsedSendTo){
        if(parsedTags.includes(parsedSendTo[item])) {
            continue;
        } else {
            throw new ValidationError("Include only tags found in the Tags section.", "sendTo")
        }
    }
}

const tryCatch = (stateSlice, validator, stateUpdate) => {
    try {
        validator(stateSlice)
    } catch (e) {
        stateUpdate(`"${e.id}" is improperly formatted. ${e.message}`)
        return e.id
    }
    stateUpdate(null)
}

export const validateJson = (state, updateTagsError, updateConfigError, updateSendToError, updateAndOrError, updateTagAlignmentError) => {
    const { tags, config, sendTo, sendType } = state
    const parsedTags = tags.split(",")
    const parsedSendTo = sendTo.split(",")

    const tryTag = tryCatch(tags, tagValidation, updateTagsError)
    const tryConfig = tryCatch(config, configValidation, updateConfigError)
    const trySendTo = tryCatch(sendTo, sendToValidation, updateSendToError)
    const tryAlignment = tryCatch({parsedTags, parsedSendTo}, alignmentValidation, updateTagAlignmentError)
    const trySendType = tryCatch(sendType, sendTypeValidation, updateAndOrError)

    const errorList = [tryTag, tryConfig, trySendTo, trySendType, tryAlignment]
    return errorList
}
