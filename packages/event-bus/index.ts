export class EventType<Payload = void> {
    symbol: symbol;

    constructor(name: string) {
        this.symbol = Symbol(name);
    }
}

export class EventBus {
    private eventHandlerMap = new SetMap<EventType<any>, EventHandler<any>>();

    private static instance?: EventBus;

    static getInstance() {
        if (!this.instance) {
            this.instance = new EventBus();
        }
        return this.instance;
    }

    static getSession() {
        return new EventSession(this.getInstance());
    }

    on<Payload>(eventType: EventType<Payload>, eventHandler: EventHandler<Payload>) {
        this.eventHandlerMap.add(eventType, eventHandler);
    }

    off(eventType: EventType, eventHandler: EventHandler) {
        this.eventHandlerMap.remove(eventType, eventHandler);
    }

    emit<Payload>(eventType: EventType<Payload>, payload: Payload) {
        const handlers = this.eventHandlerMap.getHandlers(eventType);
        handlers.forEach(handler => {
            handler(payload);
        })
    }

    getSession() {
        return new EventSession(this);
    }
}

export class EventSession {
    private eventHandlerMap = new SetMap<EventType<any>, EventHandler<any>>();

    constructor(private eventBus: EventBus) {}

    on<Payload>(eventType: EventType<Payload>, eventHandler: EventHandler<Payload>) {
        this.eventHandlerMap.add(eventType, eventHandler);
        this.eventBus.on(eventType, eventHandler);
    }

    off(eventType: EventType, eventHandler: EventHandler) {
        this.eventHandlerMap.remove(eventType, eventHandler);
        this.eventBus.off(eventType, eventHandler);
    }

    emit<Payload>(eventType: EventType<Payload>, payload: Payload) {
        this.eventBus.emit(eventType, payload);
    }

    clear() {
        this.eventHandlerMap.forEach((eventHandler, eventType) => {
            this.eventBus.off(eventType, eventHandler);
        });
    }
}

interface EventHandler<Payload = void> {
    (payload: Payload): void;
}

class SetMap<K, V> {
    private innerMap = new Map<K, Set<V>>();

    add(key: K, handler: V) {
        const handlers = this.getHandlers(key);
        handlers.add(handler);
        this.innerMap.set(key, handlers);
    }

    getHandlers(key: K) {
        return this.innerMap.get(key) || new Set();
    }

    remove(key: K, handler: V) {
        const handlers = this.getHandlers(key);
        handlers.delete(handler);
        this.innerMap.set(key, handlers);
    }

    forEach(callback: (value: V, key: K) => void) {
        this.innerMap.forEach((handlers: Set<V>, key: K) => {
            handlers.forEach((handler) => {
                callback(handler, key);
            })
        })
    }
}
