import { Component, IComponent } from "../rendering/Component";
import { WebComponent } from "../rendering/WebComponent";

type BaseType = new(...args: any[]) => {};

export const CustomElement = (name: string) => {
    return <T extends WebComponent>(component: T|BaseType) => {
        customElements.define(name, component as BaseType);
    };
};

export { Component, IComponent, WebComponent };
