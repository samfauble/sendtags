//Returns a processed list of people in the config input
const listConfigPeople = (config) => {
    const list = []
    for(let person in config) {
        list.push(person)
    }
    return list
}

//Creates list of recipients for "AND" sendType
const andMatcher = (config, sendTo) => {
    const list = listConfigPeople(config)
    const returnList = list.filter((person) => {
        const attributes = config[person]
        for(let i = 0; i <= sendTo.length-1; i++) {
            const tag = sendTo[i]
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

//Creates list of recipients for "OR" sendType
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

//Returns list of recipients depending on sendType
export const matcher = (sendType, sendTo, config) => {
    if (sendType === 'OR') {
        return orMatcher(config, sendTo)
    } else if (sendType === 'AND') {
        return andMatcher(config, sendTo)
    } else {
        throw new Error("invalid sendType received. Use AND or OR.")
    }
}