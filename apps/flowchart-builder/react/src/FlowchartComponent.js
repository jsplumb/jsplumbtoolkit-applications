import React, { useEffect, useRef, useState} from 'react';

import {SurfaceComponent,
    MiniviewComponent,
    ShapeLibraryComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import { DEFAULT, EVENT_DBL_CLICK, EVENT_CLICK, EVENT_TAP,
    BlankEndpoint, OrthogonalConnector,
    BackgroundPlugin, LassoPlugin, DrawingToolsPlugin,
    AbsoluteLayout, EVENT_CANVAS_CLICK,
    ShapeLibraryImpl,
    FLOWCHART_SHAPES, BASIC_SHAPES,
    SelectionModes
} from "@jsplumbtoolkit/browser-ui"

import Exporter from './ExportComponent'
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

import edgeMappings from "./edge-mappings"
import anchorPositions from './anchor-positions'

import './index.css'

// assigned to the SurfaceComponent we use; this gets registered on the Toolkit's global React context, allowing
// other component to access that surface.
const SURFACE_ID = "surface"

export default function FlowchartComponent() {

    const initialized = useRef(false)
    const [shapeLibrary, _] = useState(new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES]))
    const surfaceComponent = useRef(null)
    const surface = useRef(null)
    const toolkit = useRef(null)

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

    const tkParams = {
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
                // connections to/from this node can exist at any of the given anchorPositions
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
                        //cornerRadius: 5
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
        editablePaths:true,
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
        // set the size of elements from the width/height values in their backing data
        useModelForSizes:true,
        // on load, zoom the dataset so its all visible
        zoomToFit:true
    }

    // set a couple of refs and load data on "mount"
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            surface.current = surfaceComponent.current.getSurface()
            toolkit.current = surface.current.toolkitInstance
            toolkit.current.load({url: "/copyright.json"})
        }

    }, [])

    return  <div style={{width:"100%",height:"100%",display:"flex"}}>
            <div className="jtk-demo-canvas">

                <SurfaceComponent renderParams={renderParams} view={view} ref={ surfaceComponent } toolkitParams={tkParams} surfaceId={SURFACE_ID}>
                    <MiniviewComponent/>
                    <ControlsComponent/>
                </SurfaceComponent>

                <Exporter surfaceRef={surface} shapeLibrary={shapeLibrary}/>

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
