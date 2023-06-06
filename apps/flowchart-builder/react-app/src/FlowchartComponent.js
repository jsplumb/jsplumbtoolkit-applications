import React, { useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client';

import {JsPlumbToolkitSurfaceComponent,
    JsPlumbToolkitMiniviewComponent,
    ShapeLibraryPaletteComponent
} from "@jsplumbtoolkit/browser-ui-react";

import { newInstance, DEFAULT, EVENT_DBL_CLICK, EVENT_CLICK, EVENT_TAP,
    BlankEndpoint, OrthogonalConnector, initializeOrthogonalConnectorEditors,
    BackgroundPlugin,
LassoPlugin, DrawingToolsPlugin,
AbsoluteLayout, EVENT_CANVAS_CLICK,
    findClosestPoint,
    EdgePathEditor,
    ShapeLibraryImpl,
    FLOWCHART_SHAPES
} from "@jsplumbtoolkit/browser-ui"

import Inspector from './InspectorComponent'
import ControlsComponent from './ControlsComponent'
import NodeComponent from './NodeComponent'
import {GRID_BACKGROUND_OPTIONS, GRID_SIZE} from "./constants";
import edgeMappings from "./edge-mappings";

function _$_anchorPositionFinder (el, elxy) {
    const point = findClosestPoint(elxy, {w:1, h:1}, [
        {x:0, y:0.5, ox:-1, oy:0},
        {x:1, y:0.5, ox:1, oy:0},
        {x:0.5, y:0, ox:0, oy:-1},
        {x:0.5, y:1, ox:0, oy:1}
    ])
    const p = point.p
    return [ p.x, p.y, p.ox, p.oy ]
}

export default function FlowchartComponent() {

    const shapeLibrary = new ShapeLibraryImpl(FLOWCHART_SHAPES)

    const pathEditor = useRef(null)
    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)
    const paletteContainer = useRef(null)
    const inspectorContainer = useRef(null)

    const toolkit = newInstance()

    initializeOrthogonalConnectorEditors()

    const view = {
        nodes: {
            [DEFAULT]: {
                jsx: (ctx) => {
                    return <NodeComponent ctx={ctx}  shapeLibrary={shapeLibrary}/>
                },
                events: {
                    [EVENT_TAP]: (params) => {
                        pathEditor.current.stopEditing()
                        // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
                        if (toolkit.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
                            toolkit.setSelection(params.obj)
                        } else {
                            // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
                            toolkit.addToSelection(params.obj)
                        }
                    }
                }
            }
        },
        // There are two edge types defined - 'yes' and 'no', sharing a common
        // parent.
        edges: {
            [DEFAULT]: {
                endpoint: BlankEndpoint.type,
                connector: {type: OrthogonalConnector.type, options: {cornerRadius: 5}},
                paintStyle: {
                    strokeWidth: 2,
                    stroke: "rgb(132, 172, 179)",
                    outlineWidth: 3,
                    outlineStroke: "transparent"
                },	//	paint style for this edge type.
                hoverPaintStyle: {strokeWidth: 2, stroke: "rgb(67,67,67)"}, // hover paint style for this edge type.
                events: {
                    [EVENT_DBL_CLICK]: (params) => {
                        toolkit.removeEdge(params.edge)
                    },
                    [EVENT_CLICK]: (params) => {
                        toolkit.setSelection(params.edge)
                        pathEditor.current.startEditing(params.edge, {
                            deleteButton:true,
                            anchorPositionFinder: (el, elxy, vertex) => {
                                return _$_anchorPositionFinder(el, elxy)
                            }
                        })
                    }
                }
            }
        },
        ports: {
            source: {
                maxConnections: -1
            },
            target: {
                anchorPositionFinder:(el, elxy) => {
                    return _$_anchorPositionFinder(el, elxy)
                },
                maxConnections: -1,
                isTarget: true
            }
        }
    }

    const renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        grid:{
            size:GRID_SIZE
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                pathEditor.current.stopEditing()
            }
        },
        propertyMappings:{
            edgeMappings:edgeMappings()
        },
        consumeRightClick: false,
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        plugins:[
            {
                type:DrawingToolsPlugin.type,
                options:{
                    widthAttribute:"width",
                    heightAttribute:"height"
                }
            },
            {
                type:LassoPlugin.type,
                options: {
                    lassoInvert:true,
                    lassoEdges:true
                }
            },
            {
                type:BackgroundPlugin.type,
                options:GRID_BACKGROUND_OPTIONS
            }
        ],
        zoomToFit:true
    }

    useEffect(() => {

        pathEditor.current = new EdgePathEditor(surfaceComponent.current.surface, {activeMode:true})

        // controls component. needs to be done here as it needs a reference to the surface.
        const c = createRoot(controlsContainer.current)
        c.render(<ControlsComponent surface={surfaceComponent.current.surface}/>)

        // a miniview.
        const m = createRoot(miniviewContainer.current)
        m.render(
            <JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>
        );

        const slp = createRoot(paletteContainer.current)
        slp.render(<ShapeLibraryPaletteComponent surface={surfaceComponent.current.surface} shapeLibrary={shapeLibrary} container={paletteContainer.current}/>);

        const ic = createRoot(inspectorContainer.current)
        ic.render(<Inspector surface={surfaceComponent.current.surface} container={inspectorContainer.current}/>)

        toolkit.load({url:"/copyright.json"})
    }, [])

    return  <div style={{width:"100%",height:"100%",display:"flex"}}>
            <div className="jtk-demo-canvas">
                <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
                <div className="controls" ref={ controlsContainer }/>
                <div className="miniview" ref={ miniviewContainer }/>
            </div>
            <div className="jtk-demo-rhs">
                <div className="node-palette sidebar" ref={paletteContainer}></div>
                <div ref={inspectorContainer}/>
            </div>
        </div>
}
