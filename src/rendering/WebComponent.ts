import { BrowserWindow, remote } from "electron";
import { IComponent } from "./Component";
import { VDom, VDomNode } from "./VirtualDom";

export abstract class WebComponent extends HTMLElement implements IComponent {
    protected window: BrowserWindow;
    protected shadowDom: ShadowRoot;
    private vdom: VDomNode;

    constructor() {
        super();

        this.window = remote.getCurrentWindow();
        this.shadowDom = this.attachShadow({ mode: "open" });
    }

    public abstract render(): VDomNode;

    public redraw(): void {
        const newDom = this.render();
        VDom.updateElement(this.shadowDom, newDom, this.vdom);
        this.vdom = newDom;
    }

    public connectedCallback() {
        this.redraw();
    }
}
