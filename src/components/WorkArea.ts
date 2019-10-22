import { SVG } from "../components/SVG";
import { CustomElement, WebComponent } from "../rendering/Components";
import { VDomNode } from "../rendering/VirtualDom";

@CustomElement("work-area")
export class WorkArea extends WebComponent {
    private document: SVG;

    constructor() {
        super();
        this.document = new SVG();
    }

    public render(): VDomNode {
        return this.document.render();
    }
}
