import { Component } from "../rendering/Component";
import { IVDom, VDom, VDomNode } from "../rendering/VirtualDom";

export abstract class SVGComponent extends Component {
    private ns: string  = "http://www.w3.org/2000/svg";
    protected $t(nodeName: string, attrs?: object, ...children: VDomNode[]): IVDom {
        return VDom.tn(nodeName, this.ns, attrs, ...children);
    }
}
