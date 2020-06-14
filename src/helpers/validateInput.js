
/*         Module Architecture: (as a stack)

    Validator Validator Validator Validator Validator
         ||       ||        ||        ||       ||
          \\      ||        ||        ||       //
            *************tryCatch*************
                           ||
                      validateInput
*/



class ValidationError{
    
    constructor(message, id) {
        this.message = message
        this.id = id
    }
}

//Throws error if any "tags" item contains a space after the comma
const tagValidation = (tags) => {
    const tagList = tags.split(",")
    for(let item in tagList){
        if(tagList[item].indexOf(" ") !== -1) {
            throw new ValidationError("Don't put spaces after commas in Tags input.", "tags")
        }
    }
}

const configValidation = (config) => {}

//Throws error if any sendTo item contains a space after the comma
const sendToValidation = (sendTo) => {
    const sendToList = sendTo.split(",")
    for(let item in sendToList){
        if(sendToList[item].indexOf(" ") !== -1) {
            throw new ValidationError("Don't put spaces after commas in sendTo input.", "sendTo")
        }
    } 
}

//Throws error if sendType doesn't equal "OR" or "AND"
const sendTypeValidation = (sendType) => {
    if(sendType !== "OR" && sendType !== "AND") {
        throw new ValidationError("Enter only AND or OR.", "sendType")
    }
}

//Throws error if parsedTags array doesn't include each parsedSendTo item
const alignmentValidation = (stateSlice) => {
    const {parsedTags, parsedSendTo} = stateSlice;
    for(let item in parsedSendTo){
        if(parsedTags.includes(parsedSendTo[item])) {
            continue;
        } else {
            throw new ValidationError("Include only tags found in the Tags section.", "align")
        }
    }
}

//Updates error state if error is caught. Else, nullifies error state.
const tryCatch = (stateSlice, validator, stateUpdate) => {
    try {
        validator(stateSlice)
    } catch (e) {
        stateUpdate(`"${e.id}" is improperly formatted. ${e.message}`)
        return e.id
    }
    stateUpdate(null)
}

//Returns a list of errors or undefined items
export const validateInput = (state, updateTagsError, updateConfigError, updateSendToError, updateAndOrError, updateTagAlignmentError) => {
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
