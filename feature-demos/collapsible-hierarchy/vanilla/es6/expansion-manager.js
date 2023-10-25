import {
    EVENT_NODE_UPDATED,
    Selection
} from "@jsplumbtoolkit/browser-ui";

/**
 * Helper class that creates a selection and implements its generator to return a hierarchy whose depth is restricted
 * whenever a node that has `collapsed:true` set on it.
 */
export class ExpansionManager {

    toolkit
    selection
    initialized
    surface
    focus

    constructor(container, toolkit, surfaceOptions) {
        this.toolkit = toolkit

        this.selection = new Selection(toolkit, {
            generator:(selection, toolkit) => {
                const objects = []

                const _one = function(focus, level) {

                    if (focus != null) {
                        objects.push(focus)

                        if (focus.data.collapsed !== true) {
                            const edges = focus.getSourceEdges()
                            objects.push(...edges)
                            edges.forEach(edge => _one(edge.target, level+1))
                        }
                    }
                }

                _one(toolkit.getNodeAt(0), 0)

                selection.append(objects)
            },
            autoFill:true,
            onReload:() => {
                if (this.surface != null) {
                    if (this.initialized) {
                        this.surface.relayout()
                        if(this.focus != null) {
                            const pl2 = this.surface.toPageLocation(this.focus.node.data.left, this.focus.node.data.top)
                            this.surface.pan(this.focus.pl.x - pl2.x, this.focus.pl.y - pl2.y, true)
                        }
                    }
                }
            }
        })

        toolkit.bind(EVENT_NODE_UPDATED, () => this.selection.reload())

        this.surface = toolkit.render(container, Object.assign({selection:this.selection}, surfaceOptions))

        this.surface.zoomToFit()
        this.initialized = true
    }

    /**
     * Toggle the `collapsed` flag on a given node. Prior to updating the dataset, this method stores
     * the current page location of the node to be toggled. When the selection finishes its reload, we use that
     * information we adjust the canvas so that the focus node does not appear to have moved.
     * @param node
     */
    toggleNode(node) {

        if (node.data.children && node.data.children.length > 0) {

            const pl = this.surface.toPageLocation(node.data.left, node.data.top)
            this.focus = {node, left:node.data.left, top:node.data.top, pl}

            this.toolkit.updateNode(node.id, {collapsed: !node.data.collapsed})
        }
    }
}
