import { ready, newInstance, AbsoluteLayout,
    BlankEndpoint, AnchorLocations, ArrowOverlay,
    DEFAULT, EVENT_CANVAS_CLICK } from "@jsplumbtoolkit/browser-ui"

ready(() => {

    // Get a new Toolkit instance
    const toolkit = newInstance()

    // Get the DOM element to render into
    const container = document.getElementById("container")

    // Render to a Surface.
    const surface = toolkit.render(container, {
        layout:{
            // there are several layouts that ship with the toolkit.
            type:AbsoluteLayout.type,
            options:{
                //... if your chosen layout is configurable, options go here
            }
        },
        // Allows us to specify edge color (and line width) in each edge's backing data
        simpleEdgeStyles:true,
        // Use a Continuous anchor and a blank endpoint by default.
        defaults:{
            anchor:AnchorLocations.Continuous,
            endpoint:BlankEndpoint.type
        },
        events:{
            [EVENT_CANVAS_CLICK]:() => {
                toolkit.clearSelection()
            }
        },
        // map node types and edge types to appearance and behaviour
        view:{
            nodes:{
                // abstract parent node definition - declares a tap listener
                clickable:{
                    events:{
                        tap:(p) => {
                            alert(`You clicked on node ${p.obj.id}`)
                            toolkit.setSelection(p.obj)
                        }
                    }
                },
                // definition for 'hello' nodes. Extends 'clickable' to get the tap listener.
                hello:{
                    parent:"clickable",
                    template:'<div class="hello-node">{{label}}</div>'
                },
                // definition for 'world' nodes. Extends 'clickable' to get the tap listener.
                world:{
                    parent:"clickable",
                    template:'<div class="world-node">{{label}}</div>'
                }
            },
            edges:{
                // a default edge definition. Declares an arrow overlay at its tip and extracts 'label' from
                // edge data and displays it as a label overlay (by default at location 0.5)
                [DEFAULT]:{
                    overlays:[
                        {
                            type:ArrowOverlay.type,
                            options:{
                                location: 1
                            }
                        }
                    ],
                    label:"{{label}}"
                }
            }
        }
    })

    toolkit.load({
        data:{
            nodes:[
                { id:"1", type:"hello", label:"Hello", left:50, top:50 },
                { id:"2", type:"world", label:"World", left:350, top:50 }
            ],
            edges:[
                { source:"1", target:"2", data:{label:"a label", color:"purple"} }
            ]
        }
    })
})
