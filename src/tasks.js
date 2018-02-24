import knex from "./knex";

export function findQueued(clientID) {
    let query = knex('task AS t')
        .first('t.id', 't.command', 't.id AS client_id', 't.max_run_seconds', 't.run_detached',)
        .andWhere('status', 'in queue')
        .andWhere('client_id', clientID)
        .orderBy('t.id');

    return query;
}

export function setStatusRunning(task) {
    let query = knex('task')
        .where('id', task.id)
        .update('status', 'running');

    console.log(`Tasks acknowledged. SQL UPDATE => ${query.toString()}`);

    return query.then();
}
