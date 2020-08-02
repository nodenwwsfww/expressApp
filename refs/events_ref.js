const EventEmitter = require('events');

class Logger extends EventEmitter {
    log(message) {
        this.emit('message', `${message} ${Date.now()}`);
    }
}
const log = new Logger();
log.once('message', data => console.log(data));

log.log('Hello');
log.log('Hello');
log.log('Hello');