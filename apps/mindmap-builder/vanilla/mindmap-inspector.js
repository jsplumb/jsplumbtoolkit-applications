import {
    VanillaInspector
} from "@jsplumbtoolkit/browser-ui"

import { PROPERTY_LABEL, PROPERTY_NOTES } from "./definitions";


/**
 * Inspector for mindmap nodes. We extend `VanillaInspector` here and provide a resolver which, in this case,
 * only returns one template because we only inspect nodes.
 */
export class MindmapBuilderInspector extends VanillaInspector {

    constructor(options) {
        super(Object.assign(options, {
            templateResolver:(obj) => {
                return `
            <div class="jtk-inspector jtk-node-inspector">
                <div class="jtk-inspector-section">
                    <div>Label</div>
                    <input type="text" jtk-att="${PROPERTY_LABEL}" jtk-focus/>
                </div>
                
                <div class="jtk-inspector-section">
                    <div>Notes</div>
                    <textarea rows="10" jtk-att="${PROPERTY_NOTES}"/>
                </div>                
                
            </div>`
            }
        }))

    }
}
