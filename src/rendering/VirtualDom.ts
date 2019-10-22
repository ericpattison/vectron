export interface IVDom {
    type: string;
    attrs: object;
    ns?: string;
    children: Array<IVDom|string>;
}

export type VDomNode = IVDom | string;

export type DomParent = HTMLElement | ShadowRoot | ChildNode | DocumentFragment;

const diff = (a: VDomNode, b: VDomNode) => {
    return typeof a !== typeof b ||
        typeof a === "string" && a !== b ||
        (a as IVDom).type !== (b as IVDom).type;
};

const extractEventName = (name: string) => name.slice(2).toLowerCase();
const isEventProp = (name: string) => /^on/.test(name);

export abstract class VDom {
    public static t(nodeName: string, attrs?: object, ...children: VDomNode[]): IVDom {
        attrs = attrs||{};
        return {
            attrs,
            children,
            type: nodeName,
        };
    }

    public static tn(nodeName: string, namespace: string, attrs?: object, ...children: VDomNode[]): IVDom {
        attrs = attrs||{};
        return {
            attrs,
            children,
            ns: namespace,
            type: nodeName,
        };
    }

    public static updateElement(parent: DomParent, newNode: VDomNode, oldNode: VDomNode, index: number = 0) {
        if(!oldNode) {
            parent.appendChild(VDom.render(newNode));
        } else if(!newNode) {
            parent.removeChild(parent.childNodes[index]);
        } else if(diff(newNode, oldNode)) {
            parent.replaceChild(VDom.render(newNode), parent.childNodes[index]);
        } else if(typeof newNode !== "string" && typeof oldNode !== "string") {
            VDom.updateProps(parent.childNodes[index] as HTMLElement, newNode.attrs, oldNode.attrs);

            const newLen = newNode.children.length;
            const oldLen = oldNode.children.length;
            for(let i = 0; i < newLen || i < oldLen; ++i) {
                VDom.updateElement(
                    parent.childNodes[index],
                    newNode.children[i],
                    oldNode.children[i],
                    i,
                );
            }
        }
    }

    private static render(node: VDomNode): HTMLElement|Text {
        if(typeof node === "string") {
            return document.createTextNode(node);
        }

        const el = VDom.createElement(node) as HTMLElement;
        VDom.setProps(el, node.attrs);
        VDom.addEventListeners(el, node.attrs);
        node.children.map((child) => VDom.render(child)).forEach(el.appendChild.bind(el));
        return el;
    }

    private static createElement(node: IVDom): HTMLElement|Element {
        if(node.ns) {
            return document.createElementNS(node.ns, node.type);
        }
        return document.createElement(node.type);
    }

    private static setProps(target: HTMLElement, props: object) {
        Object.entries(props).map(([key, value]) => {
            VDom.setProp(target, key, value);
        });
    }

    private static updateProps(target: HTMLElement, newProps: object, oldProps: object) {
        oldProps = oldProps || {};
        const props = Object.assign({}, newProps, oldProps);
        Object.keys(props).map((key) => {
            VDom.updateProp(
                target,
                key,
                (newProps as any)[key],
                (oldProps as any)[key],
            );
        });
    }

    private static setProp(target: HTMLElement, name: string, value: any) {
        if(name === "className") {
            target.setAttribute("class", value);
        } else if(typeof value === "boolean") {
            VDom.setBooleanProp(target, name, value);
        } else {
            target.setAttribute(name, value);
        }
    }

    private static updateProp(target: HTMLElement, name: string, newVal: any, oldVal: any) {
        if(!newVal) {
            VDom.removeProp(target, name, newVal);
        }
    }

    private static removeProp(target: HTMLElement, name: string, value: any) {
        if(name === "className") {
            target.removeAttribute("class");
        } else if(typeof value === "boolean") {
            this.removeBooleanProp(target, name, value);
        } else {
            target.removeAttribute(name);
        }
    }

    private static setBooleanProp(target: HTMLElement, name: string, value: any) {
        if(value) {
            target.setAttribute(name, value);
            (target as any)[name] = true;
        } else {
            (target as any)[name] = false;
        }
    }

    private static removeBooleanProp(target: HTMLElement, name: string, value: boolean) {
        target.removeAttribute(name);
        (target as any)[name] = false;
    }

    private static addEventListeners(target: HTMLElement, props: object) {
        Object.entries(props).map(([key, value]) => {
            if(isEventProp(key)) {
                target.addEventListener(
                    extractEventName(key),
                    value.bind(target),
                );
            }
        });
    }
}
