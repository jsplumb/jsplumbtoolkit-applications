'use client'

import React, { useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client';

import {JsPlumbToolkitSurfaceComponent,
    JsPlumbToolkitMiniviewComponent,
    ShapeLibraryPaletteComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import { newInstance, DEFAULT, EVENT_DBL_CLICK, EVENT_CLICK, EVENT_TAP,
    BlankEndpoint, OrthogonalConnector, initializeOrthogonalConnectorEditors,
    BackgroundPlugin,
LassoPlugin, DrawingToolsPlugin,
AbsoluteLayout, EVENT_CANVAS_CLICK,
    EdgePathEditor,
    ShapeLibraryImpl,
    FLOWCHART_SHAPES, BASIC_SHAPES,
    SelectionModes, SvgExporterUI, ImageExporterUI
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

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES])

    const pathEditor = useRef(null)
    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)
    const paletteContainer = useRef(null)
    const inspectorContainer = useRef(null)

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

    const toolkit = newInstance({
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
    })

    //window.tk = toolkit

    initializeOrthogonalConnectorEditors()

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
                        toolkit.removeEdge(params.edge)
                    },
                    [EVENT_CLICK]: (params) => {
                        toolkit.setSelection(params.edge)
                        pathEditor.current.startEditing(params.edge, {
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

    function exportSVG() {
        new SvgExporterUI(surfaceComponent.current.surface, shapeLibrary).export({})
    }

    function exportPNG() {
        // show an image export ui, which will default tp PNG.  `dimensions` is optional - if not supplied the resulting PNG
        // will have the same size as the content.
        new ImageExporterUI(surfaceComponent.current.surface, shapeLibrary).export({dimensions:[
                { width:3000}, { width:1200}, {width:800}
        ]})
    }

    function exportJPG() {
        // show an image export ui targetting a JPG output. Here we show an alternative to providing a list of dimensions - we just mandate the
        // width we want for the output. Again, this is optional. You don't need to provide this or `dimensions`. See note above.
        new ImageExporterUI(surfaceComponent.current.surface, shapeLibrary).export({type:"image/jpeg", width:3000})
    }

    useEffect(() => {

        if (!initialized.current) {

            initialized.current = true

            pathEditor.current = new EdgePathEditor(surfaceComponent.current.surface, {activeMode:true})

            // controls component. needs to be done here as it needs a reference to the surface.
            const c = createRoot(controlsContainer.current)
            c.render(<ControlsComponent surface={surfaceComponent.current.surface}/>)

            // a miniview.
            const m = createRoot(miniviewContainer.current)
            m.render(
                <JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>
            );

            // palette from which to drag new shapes onto the canvas
            const slp = createRoot(paletteContainer.current)
            slp.render(<ShapeLibraryPaletteComponent
                            surface={surfaceComponent.current.surface}
                            shapeLibrary={shapeLibrary}
                            container={paletteContainer.current}
                            dataGenerator={dataGenerator}
                            initialSet={FLOWCHART_SHAPES.id}
            />);

            // node/edge inspector.
            const ic = createRoot(inspectorContainer.current)
            ic.render(<Inspector surface={surfaceComponent.current.surface} container={inspectorContainer.current} edgeMappings={edgeMappings()}/>)

            // load an initial dataset
            toolkit.load({url:"/copyright.json"})
        }

    }, [])

    return  <div className="flex min-w-full">
            <div className="jtk-demo-canvas">
                <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
                <div className="controls" ref={ controlsContainer }/>
                <div className="jtk-export">
                    <span>Export:</span>
                    <a href="#" id="exportSvg" onClick={() => exportSVG()}>SVG</a>
                    <a href="#" id="exportPng" onClick={() => exportPNG()}>PNG</a>
                    <a href="#" id="exportJpg" onClick={() => exportJPG()}>JPG</a>
    </div>
                <div className="miniview" ref={ miniviewContainer }/>
            </div>
            <div className="jtk-demo-rhs">
                <div className="node-palette sidebar" ref={paletteContainer}></div>
                <div ref={inspectorContainer}/>
            </div>
        </div>
}
