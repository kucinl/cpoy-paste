
type KeyActionType = 'keydown' | 'keypress' | 'keyup';

export default class Mousetrap {
    private static instance?: Mousetrap;
    static getInstance() {
        if (!Mousetrap.instance) {
            Mousetrap.instance = new Mousetrap();
        }
        return Mousetrap.instance;
    }

    constructor(targetElement: HTMLElement = document.body) {
        targetElement.addEventListener('keydown', this.onKeyDown);
        targetElement.addEventListener('keypress', this.onKeyPress);
        targetElement.addEventListener('keyup', this.onKeyUp);
    }

    private onKeyDown(e: KeyboardEvent) {
        
    }

    private onKeyPress(e: KeyboardEvent) {
        
    }

    private onKeyUp(e: KeyboardEvent) {
        
    }

    /**
     * 
     * @param combos combo `{key1}+{key2} {key3}...`
     * @param cb 
     */
    bind(combos: string | string[], cb: (e: KeyboardEvent) => boolean, actionType?: KeyActionType) {
        if (Array.isArray(combos)) {
            combos.forEach((combo) => this.bindSingleCombo(combo, cb, actionType));
        } else {
            this.bindSingleCombo(combos, cb, actionType);
        }
    }

    private bindSingleCombo(combo: string, cb: (e: KeyboardEvent) => boolean, actionType?: KeyActionType) {
        // combo可以是“连续快捷键” 用空格分隔
        const comboSequence = combo.split(' ');
        this.bindComboSequence(comboSequence, cb, actionType);
    }

    private bindComboSequence(comboSequence: string[], cb: (e: KeyboardEvent) => boolean, actionType?: KeyActionType) {
        document.addEventListener('keydown', cb);
        promiseChain(comboSequence.map((combo) => this.waitingCombo(combo, actionType))).then((es) => {
            cb(es[0]);
        });
    }

    private waitingCombo(combo: string, actionType?: KeyActionType) {
        const keys = combo.split('+');
        return Promise.all(keys.map((key) => this.waitingKey(key, actionType)));
    }

    private waitingKey(key: string, actionType?: KeyActionType): Promise<KeyboardEvent> {
        return new Promise((resolve) => {
            document.addEventListener('keydown', (e) => {
                if (e.key === key) {
                    resolve(e);
                }
            });        
        })
    }

    private isTheCombo(e: KeyboardEvent, combo: string) {
        // TODO:
        return true;
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

async function promiseChain<R>(promises: Array<Promise<R>>) {
    let result: R;
    for (const p of promises) {
        result = await p;
    }
    return result;
}

// 浏览器的原生键盘事件描述
// 只能监听单个键，可以识别大小写
// 对于组件和来说比如用`keydown`监听“ctrl+s”,会先收到一次ctrl（假设先按下它），然后收到多个s（假设一直按着快捷键），也就是
// 1.按住键时，down会一直触发，而不是仅一次
// 2.按住多个键时，后面的键会中断前面的键的事件触发