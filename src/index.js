import express from 'express';
import https from 'https';
import sio from 'socket.io';
import fs from 'fs';
import {findQueued as findQueuedTasks, setStatusRunning} from "./tasks"
import {receive as receiveReport} from "./reports"
import {mac as macSanitizer} from "./middleware/sanitizer";
import findClient from "./middleware/clientFinder";
import {logError, logException} from "./errorHandler";
import knex from "./knex";
import {execSync} from "child_process";

const {log, error} = console;
const keyPath = '/certs/server_key.pem';
const certPath = '/certs/server_cert.pem';

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    try {
        execSync(`sh ${__dirname}/../scripts/make-certs.sh`, {stdio: [0, 1, 2]});
    } catch (err) {
        error(err);
        process.exit()
    }
}

const serverKey = fs.readFileSync(keyPath);
const serverCert = fs.readFileSync(certPath);

const server = https.createServer(
    {
        key: serverKey,
        cert: serverCert,
        ca: serverCert,
        requestCert: true,
        rejectUnauthorized: true,
    },
    express()
);
const io = sio(server);
const sockets = {};

server.listen(80);

// apply middleware
io.use(macSanitizer);
io.use(findClient);

io.on('connect_error', err => log('error', JSON.stringify(err)));
io.on('connection', onConnection);

function onConnection(socket) {

    const clientID = socket.clientID;

    socket.on(
        'disconnect',
        () => onDisconnect(clientID)
    );

    socket.on(
        'report',
        (report, acknowledgeReceptionCallback) => receiveReport(clientID, report, acknowledgeReceptionCallback)
    );

    socket.on(
        'client-error',
        error => logError(error, clientID)
    );

    // Add this connection to sockets object only after binding all the events,
    // so emit('task') can not be fired upon a disconnected client.
    sockets[clientID] = socket;

    log(`CLIENT CONNECTED: ${clientID}, Sockets => ${Object.keys(sockets)}`);
}

function onDisconnect(clientID) {
    delete sockets[clientID];
    log(`CLIENT DISCONNECTED: ${clientID}, Sockets => ${Object.keys(sockets).join(', ')}`);
}

function queryTasks() {
    knex('client')
        .select('id')
        // Query only connected clients
        .whereIn('id', Object.keys(sockets))
        .then(clients => clients.map(client =>
            findQueuedTasks(client.id)
                .then(task => {

                    if (typeof task === 'undefined') {
                        // No tasks to perform
                        return;
                    }

                    if (typeof sockets[client.id] === 'undefined') {
                        // Client went offline while query was running
                        return;
                    }

                    log(task);

                    sockets[client.id].emit(
                        'task',
                        task,
                        () => setStatusRunning(task)
                    );

                    return task;
                })
                .catch(logException)
        ))
        .catch(logException)
}

// TODO: mysql-events instead of setInterval?
setInterval(queryTasks, 2000);
