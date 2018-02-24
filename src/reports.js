const knex = require('./knex');

const TYPE_STDIN = 'stdin';
const TYPE_STDOUT = 'stdout';
const TYPE_STDERR = 'stderr';
const TYPE_STARTED_AT = 'started_at';
const TYPE_ENDED_AT = 'ended_at';
const TYPE_EXIT_CODE = 'exit_code';
const TYPE_ERROR = 'error';

export function receive(clientID, report, acknowledgeReception) {

    if (
        typeof report.id === 'undefined'
        || typeof report.type === 'undefined'
        || typeof report.data === 'undefined'
    ) {
        console.error('Bad report', report);
        return;
    }

    let field = null;

    switch (report.type) {
        case TYPE_STDIN:
            field = 'stdin';
            // no-op
            acknowledgeReception();
            return;
            break;
        case TYPE_STDOUT:
            field = 'stdout';
            break;
        case TYPE_STDERR:
            field = 'stderr';
            break;
        case TYPE_STARTED_AT:
            field = 'started_at';
            break;
        case TYPE_ENDED_AT:
            field = 'ended_at';
            break;
        case TYPE_EXIT_CODE:
            field = 'exit_code';
            break;
        case TYPE_ERROR:
            field = 'error';
            break;
        default:
            console.error('Unknown report.type', report.type);
            return
    }

    let exitCode = parseInt(report.exit_code);

    if (isNaN(exitCode)) {
        exitCode = null
    }

    console.log('saving', report.id, field, report.data)

    knex('task')
        .update({
            [field]: report.data,
            'status': 'done',
            'reported_at': knex.raw('NOW()'),
        })
        .whereIn('id', report.id)
        .then(() => {
            console.log(`${clientID} reported successfully => `, report);
            acknowledgeReception();
        });
}
