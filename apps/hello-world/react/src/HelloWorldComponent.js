import React, { useEffect, useRef, useState } from "react";

import {
    newInstance,
    DEFAULT,
    AnchorLocations,
    BlankEndpoint,
    ArrowOverlay,
    AbsoluteLayout,
    EVENT_CANVAS_CLICK
} from "@jsplumbtoolkit/browser-ui"

import {
    JsPlumbToolkitSurfaceComponent
} from "@jsplumbtoolkit/browser-ui-react";


import HelloComponent from './HelloComponent'
import WorldComponent from './WorldComponent'


export default function HelloWorldComponent({ctx}) {

    const [msg, setMsg] = useState('')
    const surfaceComponent = useRef(null)

    const toolkit = newInstance()

    const renderParams= {
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
        }
    }

    const view = {
        nodes:{
            // abstract parent node definition - declares a tap listener
            clickable:{
                events:{
                    tap:(p) => {
                        setMsg(`You clicked on node ${p.obj.id}`)
                        toolkit.setSelection(p.obj)
                    }
                }
            },
            // definition for 'hello' nodes. Extends 'clickable' to get the tap listener.
            hello:{
                parent:"clickable",
                jsx:(ctx) => HelloComponent(ctx={ctx})
            },
            // definition for 'world' nodes. Extends 'clickable' to get the tap listener.
            world:{
                parent:"clickable",
                jsx:(ctx) => WorldComponent(ctx={ctx})
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


    useEffect(() => {



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
    }, [])


    return <div style={{width:"100%",height:"100%",display:"flex"}}>
                <div className="jtk-demo-canvas">
                <div className="hello-world-message">{msg}</div>
                    <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
                </div>
            </div>
}
