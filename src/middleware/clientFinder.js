import knex from "../knex";
import {logError} from "../errorHandler";

export default function findClient(socket, next) {
    const macs = socket.macs;

    knex('client')
        .first('id')
        .whereIn('mac', macs)
        .then(client => {
            if (typeof client === 'undefined') {
                throw `Unable to find client with mac address(es): ${JSON.stringify(macs)}`;
            }

            socket.clientID = client.id;

            next();
        })
        .catch(logError);
}
