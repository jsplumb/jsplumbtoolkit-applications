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
    SurfaceComponent,
    MiniviewComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import Inspector from './InspectorComponent'
import PersonComponent from "./PersonComponent";

const SURFACE_ID = "surfaceId"

export default function OrgchartComponent(props) {

    const surfaceComponent = useRef(null)
    const inspectorContainer = useRef(null)
    const toolkit = useRef(null)
    const surface = useRef(null)

    function selectPerson(person) {
        toolkit.current.setSelection(person)
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
                toolkit.current.clearSelection()
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

        surface.current = surfaceComponent.current.getSurface()
        toolkit.current = surface.current.toolkitInstance
        toolkit.current.load({
            url:`/dataset.json?q=${uuid()}`
        })
    }, [])


    return <div style={{width:"100%",height:"100%",display:"flex"}}>
            <div className="jtk-demo-canvas">

                <SurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent } surfaceId={SURFACE_ID}>
                    <MiniviewComponent/>
                </SurfaceComponent>

            </div>
            <div className="jtk-demo-rhs">
                <Inspector  surfaceId={SURFACE_ID}/>
            </div>
        </div>

}
