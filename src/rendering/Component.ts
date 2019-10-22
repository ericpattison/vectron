import { BrowserWindow, remote } from "electron";
import { VDom, VDomNode } from "../rendering/VirtualDom.js";

export interface IComponent {
    redraw(): void;
    render(): VDomNode;
}

const isEventProp = (name: string) => /^on/.test(name);

export abstract class Component implements IComponent {
    protected window: BrowserWindow;
    protected root: DocumentFragment;
    private vdom: VDomNode;
    private state: object;

    constructor() {
        this.window = remote.getCurrentWindow();
        this.root = document.createDocumentFragment();
    }

    public abstract render(): VDomNode;

    public redraw(): void {
        const newDom = this.render();
        VDom.updateElement(this.root, newDom, this.vdom);
        this.vdom = newDom;
    }

    public setState(state: object) {
        this.state = Object.assign({}, state);
        this.redraw();
    }
}
