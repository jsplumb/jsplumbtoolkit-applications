import {
    EVENT_TAP,
    EVENT_CLICK,
    EVENT_CANVAS_CLICK,
    EVENT_SURFACE_MODE_CHANGED,
    SurfaceMode,
    DotEndpoint,
    AnchorLocations,
    ready,
    newInstance,
    MiniviewPlugin,
    StateMachineConnector,
    ObjectInfo, Node,
    HierarchicalLayout,
    BalloonLayout,
    CircularLayout,
    ForceDirectedLayout,
    LassoPlugin, HierarchyLayout
} from "@jsplumbtoolkit/browser-ui"

import {randomHierarchy, randomNode} from "jsplumbtoolkit-demo-support"

ready(() =>{

    // get a new jsPlumb Toolkit instance to use.
    const toolkit = newInstance()
    // make a random hierarchy
    const hierarchy = randomHierarchy(3, 3)

    const controls = document.querySelector(".controls")

    //
    // create one renderer
    //
    function render (id:string, layoutParams:any) {
        const selector = "#demo-" + id;
        const surface = toolkit.render(document.querySelector(selector), {
            layout: layoutParams,
            events:{
                [EVENT_SURFACE_MODE_CHANGED] :(mode:SurfaceMode) => {
                    surface.removeClass(controls.querySelectorAll(selector + " [mode]"), "selected-mode");
                    surface.addClass(controls.querySelectorAll(selector + " [mode='" + mode + "']"), "selected-mode");
                },
                [EVENT_CANVAS_CLICK]: () => {
                    toolkit.clearSelection()
                }
            },
            plugins:[
                {
                    type:MiniviewPlugin.type,
                    options:{
                        container:document.getElementById("miniview-" + id)
                    }
                },
                LassoPlugin.type
            ],
            defaults: {
                anchor:AnchorLocations.Continuous,
                connector: { type:StateMachineConnector.type, options:{ curviness: 10 } },
                endpoints: [
                    { type:DotEndpoint.type, options:{ radius: 2 } },
                    { type:DotEndpoint.type, options:{ radius: 2 } }
                ],
                endpointStyle: { fill: "#89bcde" },
                endpointHoverStyle: { fill: "#FF6600" }
            },
            zoomToFit: true,
            consumeRightClick: false,
            dragOptions: {
                filter: ".delete *, .add *, .delete, .add"
            }
        });

        // bind event listeners to the mode buttons
        surface.on(document.querySelector(selector), EVENT_TAP, "[mode]", (e:Event) => {
            surface.setMode((e.target as any).getAttribute("mode"))
        })

        // on home button tap, zoom content to fit.
        surface.on(document.querySelector(selector), EVENT_TAP, "[reset]", (e:Event) => {
            toolkit.clearSelection()
            surface.zoomToFit()
        })

        surface.bindModelEvent<Node>(EVENT_TAP, ".delete", (event:Event, target:HTMLElement, info:ObjectInfo<Node>) => {
            const selection = toolkit.selectDescendants(info.obj, true)
            toolkit.remove(selection)
        })

        surface.bindModelEvent<Node>(EVENT_TAP, ".add", (event:Event, target:HTMLElement, info:ObjectInfo<Node>) => {
            // get a random node.
            const n = randomNode("node")
            // add the node to the toolkit
            const newNode = toolkit.addNode(n)
            // and add an edge for it from the current node.
            toolkit.addEdge({source: info.obj, target: newNode})
        })
    }

    //
    // renderer specs. keys are ids, values are layout params.
    //
    const rendererSpecs = {
        "hierarchy":{
            type: HierarchyLayout.type,
            axis: "horizontal",
            padding: [60, 60]
        },
        "circular":{
            type: CircularLayout.type,
            padding: 30
        },
        "force-directed":{
            type:ForceDirectedLayout.type,
            absoluteBacked:false
        },
        "balloon":{
            type:BalloonLayout.type
        }
    }

    // render each one.
    for (let id in rendererSpecs) {
        render(id, rendererSpecs[id])
    }

    // load the data
    toolkit.load({data: hierarchy})

    document.querySelector("#btnRegenerate").addEventListener(EVENT_CLICK, () => {
        toolkit.clear();
        toolkit.load({
            data:randomHierarchy(3)
        })
    })
})

