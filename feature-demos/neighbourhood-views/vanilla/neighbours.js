
import {HierarchyLayout} from "@jsplumbtoolkit/browser-ui";
import { BasePopup } from "./base-popup";

/**
 * Neighbours popup shows the focus element, its parent (if any), and its children (if any).
 */
export class NeighboursPopup extends BasePopup {

    generator() {
        return (selection, toolkit) => {
            if (this.focus != null) {
                const objects = [this.focus]
                objects.push(...this.parentObjects)
                objects.push(...this.childObjects)
                selection.append(objects)
            }
        }
    }

    getLayout() {
        return {
            type:HierarchyLayout.type,
            options:{
                getRootNode:() => this.parent
            }
        }
    }
}
