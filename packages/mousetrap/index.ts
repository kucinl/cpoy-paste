export default class Mousetrap {
    private static instance?: Mousetrap;
    static getInstance() {
        if (!Mousetrap.instance) {
            Mousetrap.instance = new Mousetrap();
        }
        return Mousetrap.instance;
    }

    bind(keys: string | string[], cb: (e: KeyboardEvent) => boolean) {

    }

    unbind(key: string, actionType?: string) {

    }

    trigger(key: string) {

    }

    stopCallback(e: KeyboardEvent, element: HTMLElement, combo: string) {

    }

    reset() {

    }

    handleKey(key: string, modifiers: string[], e: KeyboardEvent) {

    }
}
