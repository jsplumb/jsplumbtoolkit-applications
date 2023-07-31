import {
    Base,
    isNode,
    isEdge,
    VanillaInspectorOptions,
    VanillaInspector, isPort, Surface
} from "@jsplumbtoolkit/browser-ui"
import {
    PROPERTY_CARDINALITY,
    TABLE, VIEW
} from "./constants"

import { datatypes, cardinalities } from "./definitions"

const TMPL_TABLE_INSPECTOR = "tmplTableInspector"
const TMPL_VIEW_INSPECTOR = "tmplViewInspector"
const TMPL_EDGE_INSPECTOR = "tmplEdgeInspector"
const TMPL_COLUMN_INSPECTOR = "tmplColumnInspector"

/**
 * Options for the schema inspector
 */
export type SchemaInspectorOptions = {
    surface:Surface,
    container:HTMLElement
}

/**
 * Templates for the inspector. We have a different inspector template for table, view, column and edge (relationship).
 */
const inspectorTemplates = {
    [TMPL_TABLE_INSPECTOR] : `
            <div class="jtk-inspector jtk-node-inspector">
                <div>Name</div>
                  <input type="text" jtk-att="name" jtk-focus/>                               
            </div>`,
    [TMPL_VIEW_INSPECTOR] : `
            <div class="jtk-inspector jtk-node-inspector">
                <div>Name</div>
                <input type="text" jtk-att="name" jtk-focus/>
                <div>Query</div>
                <textarea jtk-att="query" rows="10"/>                               
            </div>`,
    [TMPL_COLUMN_INSPECTOR] : `
            <div class="jtk-inspector jtk-node-inspector">
                <div>Name</div>
                 <input type="text" jtk-att="name" jtk-focus/>
                 <div>Datatype</div>
                 ${datatypes.map(d =>`<label><input type="radio" jtk-att="datatype" name="datatype" value="${d.id}"/>${d.description}</label>`).join("")}
            </div>`,
    [TMPL_EDGE_INSPECTOR] : `
            <div class="jtk-inspector jtk-edge-inspector">
                <div>Cardinality</div>                       
                ${cardinalities.map(c => `<label><input type="radio" name="${PROPERTY_CARDINALITY}" jtk-att="${PROPERTY_CARDINALITY}" value="${c.id}"/>${c.name}</label>`).join("")}                            
            </div>`
}

/**
 * Inspector for nodes/edges. We extend `VanillaInspector` here and provide a resolver to get an appropriate
 * template based on whether the inspector is editing a node/nodes or an edge.
 */
export class SchemaBuilderInspector extends VanillaInspector {

    constructor(options:SchemaInspectorOptions) {
        super(Object.assign(options, {
            templateResolver:(obj:Base) => {
                if (isNode(obj)) {
                    if (obj.type === TABLE) {
                        return inspectorTemplates[TMPL_TABLE_INSPECTOR]
                    } else if (obj.type === VIEW) {
                        return inspectorTemplates[TMPL_VIEW_INSPECTOR]
                    }
                } else if (isEdge(obj)) {
                    return inspectorTemplates[TMPL_EDGE_INSPECTOR]
                } else if (isPort(obj)) {
                    return inspectorTemplates[TMPL_COLUMN_INSPECTOR]
                }
            }
        }) as VanillaInspectorOptions)
    }
}
