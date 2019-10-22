import { SVGComponent } from "../components/SVGComponent";
import { IDimension } from "../models/dimension";
import { IRect } from "../models/rect";
import { VDomNode } from "../rendering/VirtualDom";

export class Guides extends SVGComponent {
    private width: number;
    private height: number;

    private artSpace: IDimension;

    constructor() {
        super();
        this.width = 11;
        this.height = 8.5;

        this.artSpace = {
            h: 6,
            w: 8,
        };
    }

    public render(): VDomNode {
        const outer: IRect = {
            h: this.height,
            w: this.width,
            x: -this.width/2,
            y: -this.height/2,
        };

        const inner: IRect = {
            h: this.artSpace.h,
            w: this.artSpace.w,
            x: -this.artSpace.w/2,
            y: -this.artSpace.h/2,
        };

        return this.$t("g", {},
            this.$t("rect", {"x": outer.x, "y": outer.y, "width": outer.w, "height": outer.h, "stroke": "#000", "stroke-width": "0.1", "fill-opacity": 0}),
            this.$t("rect", {"x": inner.x, "y": inner.y, "width": inner.w, "height": inner.h, "stroke": "#ccc", "stroke-width": "0.1", "fill-opacity": 0}),
        );
    }
}
