import {HierarchyLayout} from "@jsplumbtoolkit/browser-ui";

import { BasePopup } from "./base-popup"

export class SuccessorsPopup extends BasePopup {

    generator() {
        return (selection, toolkit) =>  {
            if (this.focus != null) {
                const objects = [this.focus]
                objects.push(...this.childObjects)
                selection.append(objects)
            }
        }
    }

    getLayout() {
        return {
            type: HierarchyLayout.type,
            options: {
                getRootNode: () => this.focus
            }
        }
    }
}
