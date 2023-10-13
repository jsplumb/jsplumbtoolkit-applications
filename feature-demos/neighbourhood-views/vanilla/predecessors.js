
import {HierarchyLayout} from "@jsplumbtoolkit/browser-ui";

import { BasePopup } from "./base-popup";

/**
 * Predecessors popup - shows the focus element and its parent, if any.
 */
export class PredecessorsPopup extends BasePopup {

    generator() {
        return (selection, toolkit) => {
            if (this.focus != null) {
                const objects = [this.focus]
                if (this.parent != null) {
                    objects.push(...[this.parent, this.parentEdge])
                }
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
