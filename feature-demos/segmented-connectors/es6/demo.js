
import {
    ready,
    newInstance,
    AbsoluteLayout,
    SegmentedConnector,
    EdgePathEditor,
    EVENT_TAP,
    initializeSegmentedConnectorEditors,
    AnchorLocations,
    BlankEndpoint,
    EVENT_CANVAS_CLICK,
    ArrowOverlay
} from "@jsplumbtoolkit/browser-ui"

initializeSegmentedConnectorEditors()

ready(() => {

    const data = {
        nodes:[
            { id:"1", left:-100, top:0 },
            { id:"2", left:350, top:0 },
            { id:"3", left:350, top:450 },
            { id:"4", left:0, top:350 }
        ],
        edges:[
            {
                source:"1",
                target:"2",
                geometry:{
                    "segments":[
                        {"x":237, "y":200 },
                        {"x":197,"y":-7}
                    ],
                    "source":{
                        "curX":72,
                        "curY":56,
                        "x":1,
                        "y":0.5,
                        "ox":1,
                        "oy":0
                    },
                    "target":{
                        "curX":350,
                        "curY":56,
                        "x":0,
                        "y":0.5,
                        "ox":-1,
                        "oy":0
                    }
                }
            },
            { source:"2", target:"3" },
            { source:"3", target:"4" },
            { source:"4", target:"1" }
        ]
    }

    const renderOptions = {
        zoomToFit:true,
        layout:{
            type:AbsoluteLayout.type
        },
        defaults:{
            connector:{
                type:SegmentedConnector.type
            },
            anchor:AnchorLocations.AutoDefault,
            endpoint:BlankEndpoint.type
        },
        view:{
            nodes:{
                default:{
                    template:`<div data-jtk-target="true">
                        {{id}}
                        <div class="jtk-connect" data-jtk-source="true"></div>
                        </div>`

                }
            },
            edges:{
                default:{
                    events:{
                        [EVENT_TAP]:(p) => pathEditor.startEditing(p.edge)
                    },
                    overlays:[
                        {
                            type:ArrowOverlay.type,
                            options:{
                                location:1
                            }
                        }
                    ]
                }
            }
        },
        events:{
            [EVENT_CANVAS_CLICK]:() => pathEditor.stopEditing()
        }

    }

    // get a jsPlumbToolkit instance.
    const toolkit = newInstance()

    const mainElement = document.querySelector("#jtk-demo-connectors"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas")

    window.t = toolkit

    let surface = toolkit.render(canvasElement, renderOptions)
    let pathEditor = new EdgePathEditor(surface)

    function load() {
        // load the dataset and then start editing the first edge after load.
        toolkit.load({
            data,
            onload:() => {
                pathEditor.startEditing(toolkit.getAllEdges()[0])
            }
        })
    }

    load()


/*
    TOGGLING SMOOTH CONNECTORS

    This block of code toggle the smooth connectors on/off - it updates the render options and then clears the Toolkit, destroys
    the current surface and re-renders.

 */
    let smooth = false
    window.toggleConnectorSmoothing = () => {
        smooth = !smooth
        renderOptions.defaults.connector = {
            type:SegmentedConnector.type,
            options:{
                smooth
            }
        }
        toolkit.clear()
        surface.destroy()
        surface = toolkit.render(canvasElement, renderOptions)
        pathEditor = new EdgePathEditor(surface)
        // load the dataset and then start editing the first edge after load.
        load()

    }

})

