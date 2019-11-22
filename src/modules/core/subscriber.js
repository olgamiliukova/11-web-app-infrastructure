export default class Subscriber {
    constructor (handlers = []) {
        this.handlers = handlers;
    }

    addHandler (handler) {
        this.handlers.push(handler);
    }

    subscribe () {
        this.handlers.forEach((handler) => handler.call(this, this));
    }
}
