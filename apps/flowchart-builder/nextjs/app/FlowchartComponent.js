'use client'

import React, { useEffect, useRef, useState} from 'react';

import {SurfaceComponent,
    MiniviewComponent,
    ShapeLibraryComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import { DEFAULT, EVENT_DBL_CLICK, EVENT_CLICK, EVENT_TAP,
    BlankEndpoint, OrthogonalConnector,
    BackgroundPlugin,
LassoPlugin, DrawingToolsPlugin,
AbsoluteLayout, EVENT_CANVAS_CLICK,
    ShapeLibraryImpl,
    FLOWCHART_SHAPES, BASIC_SHAPES,
    SelectionModes
} from "@jsplumbtoolkit/browser-ui"

import Inspector from './InspectorComponent'
import NodeComponent from './NodeComponent'
import {
    DEFAULT_FILL,
    DEFAULT_STROKE,
    DEFAULT_TEXT_COLOR,
    CLASS_EDGE_LABEL,
    CLASS_FLOWCHART_EDGE,
    GRID_BACKGROUND_OPTIONS,
    GRID_SIZE,
    EDGE_TYPE_TARGET_ARROW, PROPERTY_COLOR, PROPERTY_LABEL, PROPERTY_LINE_STYLE
} from "./constants";
import edgeMappings from "./edge-mappings";

// assigned to the SurfaceComponent we use; this gets registered on the Toolkit's global React context, allowing
// other component to access that surface.
const SURFACE_ID = "surface"

import './index.css'

//
// these anchor positions are used by the drag/drop of new edges, and also by the edge path editor
//
export const anchorPositions = [
    {x:0, y:0.5, ox:-1, oy:0, id:"left" },
    {x:1, y:0.5, ox:1, oy:0, id:"right" },
    {x:0.5, y:0, ox:0, oy:-1, id:"top" },
    {x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]

export default function FlowchartComponent() {

    const [shapeLibrary, _] = useState(new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES]))
    const surface = useRef(null)
    const toolkit = useRef(null)
    const surfaceComponent = useRef(null)

    const initialized = useRef(false)

    /**
     * Generator for data for nodes dragged from palette.
     * @param el
     */
    const dataGenerator = (el) => {
        return {
            fill:DEFAULT_FILL,
            outline:DEFAULT_STROKE,
            textColor:DEFAULT_TEXT_COLOR
        }
    }

    const toolkitParams ={
        // set the Toolkit's selection mode to 'isolated', meaning it can select a set of edges, or a set of nodes, but it
        // cannot select a set of nodes and edges. In this demonstration we use an inspector that responds to events from the
        // toolkit's selection, so setting this to `isolated` helps us ensure we dont try to inspect edges and nodes at the same
        // time.
        selectionMode:SelectionModes.isolated,
        // This is the payload to set when a user begins to drag an edge - we return values for the
        // edge's label, color and line style. If you wanted to implement a mechanism whereby you have
        // some "current style" you could update this method to return some dynamically configured
        // values.
        beforeStartConnect:(node, edgeType) => {
            return {
                [PROPERTY_LABEL]:"",
                [PROPERTY_COLOR]:DEFAULT_STROKE,
                [PROPERTY_LINE_STYLE]:EDGE_TYPE_TARGET_ARROW
            }
        }
    }

    const view = {
        nodes: {
            [DEFAULT]: {
                jsx: (ctx) => {
                    return <NodeComponent ctx={ctx}  shapeLibrary={shapeLibrary}/>
                },
                // target connections to this node can exist at any of the given anchorPositions
                anchorPositions,
                // node can support any number of connections.
                maxConnections: -1,
                events: {
                    [EVENT_TAP]: (params) => {
                        surface.current.stopEditingPath()
                        // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
                        if (toolkit.current.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
                            toolkit.current.setSelection(params.obj)
                        } else {
                            // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
                            toolkit.current.addToSelection(params.obj)
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
                connector: {
                    type: OrthogonalConnector.type,
                    options: {
                        cornerRadius: 5
                    }
                },
                cssClass:CLASS_FLOWCHART_EDGE,
                labelClass:CLASS_EDGE_LABEL,
                label:"{{label}}",
                outlineWidth:10,
                events: {
                    [EVENT_DBL_CLICK]: (params) => {
                        toolkit.current.removeEdge(params.edge)
                    },
                    [EVENT_CLICK]: (params) => {
                        toolkit.current.setSelection(params.edge)
                        surface.current.startEditingPath(params.edge, {
                            deleteButton:true
                        })
                    }
                }
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
                toolkit.current.clearSelection()
                surface.current.stopEditingPath()
            }
        },
        propertyMappings:{
            edgeMappings:edgeMappings()
        },
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
        editablePaths:true,
        consumeRightClick: false,
        useModelForSizes:true,
        zoomToFit:true
    }

    useEffect(() => {

        if (!initialized.current) {

            initialized.current = true

            surface.current = surfaceComponent.current.getSurface()
            toolkit.current = surface.current.toolkitInstance
            toolkit.current.load({url: "/copyright.json"})
        }

    }, [])

    return  <div className="flex min-w-full">
            <div className="jtk-demo-canvas">
                <SurfaceComponent renderParams={renderParams} toolkitParams={toolkitParams} view={view} ref={ surfaceComponent } surfaceId={SURFACE_ID}>
                    <MiniviewComponent/>
                    <ControlsComponent/>
                </SurfaceComponent>
            </div>
            <div className="jtk-demo-rhs">
                <div className="node-palette sidebar">
                    <ShapeLibraryComponent
                        surfaceId={SURFACE_ID}
                        shapeLibrary={shapeLibrary}
                        dataGenerator={dataGenerator}
                        initialSet={FLOWCHART_SHAPES.id}/>
                </div>
                <Inspector surfaceId={SURFACE_ID} edgeMappings={edgeMappings()}/>
            </div>
        </div>
}
