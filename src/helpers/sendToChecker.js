const sendToErrorMessage = "sendTo attribute was not found in Tags. Please make sure all sendTo attributes are included in Tags input"

export const checkSendTo = (parsedTags, parsedSendTo) => {
    for (let item in parsedSendTo) {
        if (parsedTags.includes(parsedSendTo[item])) {
            continue
        } else {
            throw new Error(sendToErrorMessage)
        }
    }
}