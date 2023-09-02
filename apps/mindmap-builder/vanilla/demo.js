import {
    newInstance,
    ready,
    SegmentedConnector,
    AnchorLocations,
    EVENT_TAP, uuid,
    ControlsComponent,
    EVENT_GRAPH_CLEARED
} from "@jsplumbtoolkit/browser-ui"

import { SUBTOPIC, LEFT, RIGHT, MAIN } from './definitions'
import { MINDMAP_JSON } from "./parser";
import { MindmapLayout } from './layout'

ready(() => {


    const container = document.querySelector(".jtk-demo-canvas"),
        controlsElement = document.querySelector(".jtk-controls-container")

    const toolkit = newInstance()

    window.t = toolkit

    const surface = toolkit.render(container, {
        // in this app, elements are not draggable; they are fixed by the layout.
        elementsDraggable:false,
        // after load, zoom the display so all nodes are visible.
        zoomToFit:true,
        // show connections to ports as being attached to their parent nodes. We use this for the main node: its edges
        // are connected to either a `right` or `left` port on the main node, but these ports are logical ports only - they
        // do not have their own DOM element assigned.
        logicalPorts:true,
        // Run a relayout whenever a new edge is established, which happens programmatically when the user adds a new subtopic.
        refreshLayoutOnEdgeConnect:true,
        // for the purposes of testing. Without this the right mouse button is disabled by default.
        consumeRightClick:false,
        // Use our custom mindmap layout.
        layout:{
            type:MindmapLayout.type
        },
        view:{
            nodes:{
                main:{
                    template:`<div class="jtk-mindmap-main jtk-mindmap-vertex">
                    {{label}}
                    <div class="jtk-add-mindmap-child" data-direction="${LEFT}"></div>
                    <div class="jtk-add-mindmap-child" data-direction="${RIGHT}"></div>
                    </div>`
                },
                subtopic:{
                    template:`<div class="jtk-mindmap-subtopic jtk-mindmap-vertex">
                        {{label}}
                        <div class="jtk-add-mindmap-child" data-direction="{{direction}}"></div>
                        <div class="jtk-add-mindmap-delete"></div>
                        </div>`
                }
            }
        },

        modelEvents:[
            {
                event:EVENT_TAP,
                selector:".jtk-add-mindmap-child",
                callback:(event, eventTarget, modelObject) => {
                    // read out the direction for this edge.
                    const direction = eventTarget.getAttribute("data-direction")
                    // for edges from the main node, we attach them to a port on the node, because the main node can
                    // have `left` and `right` edges. For subtopic nodes we attach directly to the node. So this code tests
                    // for a matching port and uses it as the source if found, otherwise it uses the source node.
                    const source = modelObject.obj.getPort(direction) || modelObject.obj
                    const payload = {
                        id:uuid(),
                        parentId:modelObject.obj.id,
                        label:"New subtopic",
                        children:[],
                        type:SUBTOPIC,
                        direction
                    }

                    toolkit.transaction(() => {
                        const node = toolkit.addNode(payload)
                        toolkit.addEdge({source, target:node})
                    })

                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-add-mindmap-delete",
                callback:(event, eventTarget, modelObject) => {
                    // select the node that was clicked and all of its descendants (we get a Selection object back)
                    const nodeAndDescendants = toolkit.selectDescendants(modelObject.obj, true)
                    // inside a transaction, remove everything in that selection from the Toolkit (including edges to each of the nodes).
                    // we do this inside a transaction so we can undo the whole operation as one unit.
                    toolkit.transaction(() => {
                        toolkit.remove(nodeAndDescendants)
                    })

                }
            }
        ],
        defaults:{
            connector:{
                type:SegmentedConnector.type,
                options:{
                    stub:20
                }
            },
            anchor:[
                AnchorLocations.Left, AnchorLocations.Right
            ]
        }
    })

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new ControlsComponent(controlsElement, surface)
    // bind to graph cleared event and add a new main node, then center it.
    toolkit.bind(EVENT_GRAPH_CLEARED, () => {
        toolkit.addNode({
            id:uuid(),
            type:MAIN,
            left:[],
            right:[],
            label:"Main"
        })
        surface.zoomToFit()
    })

    toolkit.load({
        type:MINDMAP_JSON,
        url:"./mindmap.json"
    })

})
