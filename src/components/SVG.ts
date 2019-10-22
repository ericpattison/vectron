import { IRect } from "../models/rect";
import { Component } from "../rendering/Components";
import { VDomNode } from "../rendering/VirtualDom";
import { Guides } from "./Guides";
import { SVGComponent } from "./SVGComponent";

export class SVG extends SVGComponent {
    private width: number;
    private height: number;

    private guides: Guides;

    constructor() {
        super();

        this.width = 11;
        this.height = 8.5;

        this.guides = new Guides();
    }

    public render(): VDomNode {
        const rect: IRect = {
            h: this.height,
            w: this.width,
            x: -this.width/2,
            y: -this.height/2,
        };

        return this.$t("svg", {
            height: `${rect.h}in`,
            style: "display: flex; justify-content: center; align-items: center;",
            viewBox: `${rect.x} ${rect.y} ${rect.w}, ${rect.h}`,
            width: `${rect.w}in`,
        }, ...this.childComponents().map((component) => component.render()));
    }

    private childComponents(): Component[] {
        return [
            this.guides,
        ];
    }
}
