
import {HierarchyLayout} from "@jsplumbtoolkit/browser-ui";

import { BasePopup } from "./base-popup";

export class SiblingsPopup extends BasePopup {

    generator() {
        return (selection, toolkit) => {
            if (this.focus != null) {
                selection.append(this.siblingObjects)
            }
        }
    }

    getLayout() {
        return {
            type:HierarchyLayout.type,
            options:{
                getRootNode:() => this.focus
            }
        }
    }
}
