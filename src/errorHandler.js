export function logError(error, clientID = null) {
    if (clientID !== null) {
        console.error(`${clientID} reported an error => `, error);
    } else {
        console.error(`reported an error => `, error);
    }
}

export function logException(e) {
    console.error("An exception occurred", e);
}
