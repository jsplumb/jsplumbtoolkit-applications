import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import './orgchart.css'

import {
    newInstance,
    isPort,
    DEFAULT,
    AnchorLocations,
    BlankEndpoint,
    EVENT_CLICK,
    EVENT_TAP,
    uuid,
    HierarchyLayout,
    PlainArrowOverlay,
    EVENT_CANVAS_CLICK
} from "@jsplumbtoolkit/browser-ui"

import {
    JsPlumbToolkitSurfaceComponent,
    JsPlumbToolkitMiniviewComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import InspectorComponent from './InspectorComponent'
import PersonComponent from "./PersonComponent";

export default function OrgchartComponent(props) {

    const toolkit = newInstance()

    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)
    const inspectorContainer = useRef(null)

    function selectPerson(person) {
        toolkit.setSelection(person)
        surfaceComponent.current.surface.centerOnAndZoom(person, 0.15)
    }

    const renderParams = {
        consumeRightClick:false,
        elementsDraggable:false,
        defaults:{
            endpoint:BlankEndpoint.type,
            anchor:AnchorLocations.ContinuousTopBottom
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                this.toolkit.clearSelection()
            }
        },
        zoomToFit:true,
        layout:{
            type: HierarchyLayout.type
        }
    }

    const view = {
        nodes: {
            [DEFAULT]: {
                events: {
                    [EVENT_TAP]: (p) => {
                        selectPerson(p.obj)
                    }
                },
                jsx:(ctx) => <PersonComponent ctx={ctx}/>
            }

        },
        edges: {
            default: {
                overlays: [
                    {
                        type: PlainArrowOverlay.type,
                        options: {
                            location: 1,
                            width: 10,
                            length: 10
                        }
                    }
                ]
            }
        }
    }

    useEffect(() => {
        const i = createRoot(inspectorContainer.current)
        i.render(<InspectorComponent surface={surfaceComponent.current.surface} onSelect={(e) => selectPerson(e)}/>)

        const m = createRoot(miniviewContainer.current)
        m.render(<JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>)

        toolkit.load({
            url:`/dataset.json?q=${uuid()}`
        })
    }, [])


    return <div style={{width:"100%",height:"100%",display:"flex"}}>
            <div className="jtk-demo-canvas">
                <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
                <div className="miniview" ref={ miniviewContainer }/>
            </div>
            <div className="jtk-demo-rhs">
                <div id="inspector" ref={inspectorContainer}/>
            </div>
        </div>

}
