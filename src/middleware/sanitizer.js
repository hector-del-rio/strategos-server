const regex = /((?:[a-zA-Z0-9]{2}[:-]){5}[a-zA-Z0-9]{2})/;

function macSanitizer(macs) {

    // validate mac addresses
    macs = macs
        .split(',')
        .reduce((carry, mac) => {

            // match mac regex
            if (regex.exec(mac) === null) {
                return carry;
            }

            // remove separators
            mac = mac.replace(/[:\-]/g, '');

            if (mac.length !== 12) {
                return carry;
            }

            // ensure ':' separator
            mac = mac.match(/../g).join(':');

            return carry.concat(mac);
        }, []);

    if (!macs.length) {
        return false;
    }

    return macs;
}

export function mac(socket, next) {
    const mac = socket.handshake.query.mac;

    if (typeof mac === 'undefined') {
        console.error("MAC parameter not defined");
        return;
    }

    const macs = macSanitizer(mac);

    if (macs === false) {
        console.error(`Bad MAC parameter content: ${mac}`);
        return;
    }

    socket.macs = macs;

    next();
}
