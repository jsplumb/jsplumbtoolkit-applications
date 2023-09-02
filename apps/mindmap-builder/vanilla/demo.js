import {
    newInstance,
    ready,
    SegmentedConnector,
    AnchorLocations,
    EVENT_TAP, uuid
} from "@jsplumbtoolkit/browser-ui"

import { SUBTOPIC } from './definitions'
import {MINDMAP_JSON} from "./parser";
import { MindmapLayout } from './layout'

ready(() => {


    const container = document.querySelector(".jtk-demo-canvas")

    const toolkit = newInstance()

    toolkit.render(container, {
        elementsDraggable:false,
        zoomToFit:true,
        layout:{
            type:MindmapLayout.type
        },
        view:{
            nodes:{
                main:{
                    template:`<div class="jtk-mindmap-main jtk-mindmap-vertex">{{label}}</div>`
                },
                subtopic:{
                    template:`<div class="jtk-mindmap-subtopic jtk-mindmap-vertex" data-direction="{{direction}}">
                        {{label}}
                        <div class="jtk-add-mindmap-child"></div>
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
                    const payload = {
                        id:uuid(),
                        direction:modelObject.obj.data.direction,
                        parentId:modelObject.obj.id,
                        label:"New subtopic",
                        children:[],
                        type:SUBTOPIC
                    }
                    modelObject.obj.data.children.push(payload)
                    toolkit.transaction(() => {
                        const node = toolkit.addNode(payload)
                        toolkit.addEdge({source:modelObject.obj, target:node})
                    })

                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-add-mindmap-delete",
                callback:(event, eventTarget, modelObject) => {
                    // select the node that was clicked and all of its descendants (we get a Selection object back)
                    const nodeAndDescendants = toolkit.selectDescendants(modelObject.obj, true)
                    // remove everything in that selection from the Toolkit (including edges to each of the nodes)
                    toolkit.remove(nodeAndDescendants)
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

    toolkit.load({
        type:MINDMAP_JSON,
        url:"./mindmap.json"
    })

})
