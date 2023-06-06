
import {
    newInstance,
    ready, uuid,
    OrthogonalConnector, BlankEndpoint, DEFAULT, EVENT_TAP,
    EdgePathEditor, LassoPlugin,
    DrawingToolsPlugin, MiniviewPlugin,
    EVENT_CANVAS_CLICK, AbsoluteLayout,
    initializeOrthogonalConnectorEditors,
    AnchorLocations, findClosestPoint,
    BackgroundPlugin,
    SelectionModes,
    ShapeLibraryImpl, ShapeLibraryPalette, FLOWCHART_SHAPES
} from "@jsplumbtoolkit/browser-ui"

import { FlowchartBuilderControls } from './controls'
import edgeMappings from './edge-mappings'
import {
    CLASS_EDGE_LABEL,
    CLASS_FLOWCHART_EDGE,
    DEFAULT_STROKE,
    GRID_BACKGROUND_OPTIONS,
    GRID_SIZE,
    PROPERTY_COLOR,
    DEFAULT_TEXT_COLOR,
    PROPERTY_TEXT_COLOR, EDGE_TYPE_TARGET_ARROW, DEFAULT_FILL, PROPERTY_LINE_STYLE, PROPERTY_LABEL
} from "./constants";

import {FlowchartBuilderInspector} from "./flowchart-inspector";

const START = "start"

// this call ensures that the esbuild does not tree-shake the orthogonal connector editors out.
initializeOrthogonalConnectorEditors()

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


ready(() => {

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES]);
    let edgeEditor;
    let renderer;

    // get the various dom elements
    const mainElement = document.querySelector("#jtk-demo-flowchart"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview"),
        nodePaletteElement = mainElement.querySelector(".node-palette"),
        controlsElement = mainElement.querySelector(".controls"),
        inspectorElement = mainElement.querySelector(".inspector")

    // Declare an instance of the Toolkitand supply a beforeConnect interceptor, used
    // to control what can be connected to what.
    const toolkit = newInstance({
        // set the Toolkit's selection mode to 'isolated', meaning it can select a set of edges, or a set of nodes, but it
        // cannot select a set of nodes and edges. In this demonstration we use an inspector that responds to events from the
        // toolkit's selection, so setting this to `isolated` helps us ensure we dont try to inspect edges and nodes at the same
        // time. But note that we _can_ inspect multiple nodes or edges at once.
        selectionMode:SelectionModes.isolated,
        edgeFactory:(type, data, continueCallback, abortCallback) => {
            continueCallback({
                [PROPERTY_LABEL]:"",
                [PROPERTY_COLOR]:DEFAULT_STROKE,
                [PROPERTY_LINE_STYLE]:EDGE_TYPE_TARGET_ARROW
            })

            return true;
        },
        beforeStartConnect:(node, edgeType) => {
            // limit edges from start node to 1. if any other type of node, return a payload for the edge.
            // if there is already a label set for the edge (say, if it was connected programmatically or via
            // edge undo/redo), this label is ignored.
            return (node.data.type === START && node.getEdges().length > 0) ? false : { label:"..." }
        }
    });

    window.tk = toolkit;


    // Instruct the toolkit to render to the 'canvas' element. We pass in a view of nodes, edges and ports, which
    // together define the look and feel and behaviour of this renderer.  Note that we can have 0 - N renderers
    // assigned to one instance of the Toolkit..
    renderer = toolkit.render(canvasElement, {
        templateMacros:{
            textColor:(data) => {
                return data[PROPERTY_TEXT_COLOR] || DEFAULT_TEXT_COLOR
            }
        },
        view: {
            nodes: {
                default:{
                    template:`<div style="left:{{left}}px;top:{{top}}px;width:{{width}}px;height:{{height}}px;color:{{#textColor}}" class="flowchart-object flowchart-{{type}}" data-jtk-target="true" data-jtk-target-port-type="target">
                            <jtk-shape/>
                            <span>{{text}}</span>                            
                            <div class="jtk-connect" data-jtk-anchor-x="0" data-jtk-anchor-y="0.5" data-jtk-orientation-x="-1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style="left:0;top:50%;transform: translate(-50%, -50%);"></div>
                            <div class="jtk-connect" data-jtk-anchor-x="1" data-jtk-anchor-y="0.5" data-jtk-orientation-x="1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style="right:0;top:50%;transform: translate(50%, -50%);"></div>
                            <div class="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="0" data-jtk-orientation-x="0"  data-jtk-orientation-y="-1" data-jtk-source="true" data-jtk-port-type="source" style="left:50%;top:0;transform: translate(-50%, -50%);"></div>
                            <div class="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="1" data-jtk-orientation-x="0"  data-jtk-orientation-y="1" data-jtk-source="true" data-jtk-port-type="source" style="left:50%;bottom:0;transform: translate(-50%, 50%);"></div>
                            <div class="node-delete node-action delete"/>
                        </div>`,
                        events: {
                            [EVENT_TAP]: (params) => {
                                edgeEditor.stopEditing()
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
            edges: {
                [DEFAULT]: {
                    endpoint:BlankEndpoint.type,
                    connector: {
                        type:OrthogonalConnector.type,
                        options:{
                            cornerRadius: 3,
                            alwaysRespectStubs:true
                        }
                    },
                    cssClass:CLASS_FLOWCHART_EDGE,
                    labelClass:CLASS_EDGE_LABEL,
                    label:"{{label}}",
                    outlineWidth:10,
                    events: {
                        click:(p) => {
                            toolkit.setSelection(p.edge)
                            edgeEditor.startEditing(p.edge, {
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
        },
        // see `edge-mappings.js` for details.
        propertyMappings:{
            edgeMappings:edgeMappings()
        },
        // Layout the nodes using an absolute layout
        layout: {
            type: AbsoluteLayout.type
        },
        grid:{
            size:GRID_SIZE
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                edgeEditor.stopEditing()
            }
        },
        consumeRightClick: false,
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        plugins:[
            {
                type: MiniviewPlugin.type,
                options: {
                    container: miniviewElement
                }
            },
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
        magnetize:{
            afterDrag:true
        },
        defaults:{
           anchor:AnchorLocations.AutoDefault
        },
        modelEvents:[
            {
                event:EVENT_TAP,
                selector:".node-delete",
                callback:(event, eventTarget, info) => {
                    toolkit.removeNode(info.obj)
                }
            }
        ]
    })

    window.r = renderer

    // manager for editing edge paths
    edgeEditor = new EdgePathEditor(renderer, {activeMode: true})

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new FlowchartBuilderControls(controlsElement, toolkit, renderer)

    // the palette displays a list of shapes that can be dragged on to the canvas
    new ShapeLibraryPalette ({
        container:nodePaletteElement,
        shapeLibrary,
        surface:renderer,
        dataGenerator:(el) => {
            return {
                textColor:DEFAULT_TEXT_COLOR,
                outline:DEFAULT_STROKE,
                fill:DEFAULT_FILL
            }
        }
    })

    new FlowchartBuilderInspector({
        toolkit,
        container:inspectorElement,
        surface:renderer

    })

    // Load the data.
    toolkit.load({
        url: `./copyright.json?q=${uuid()}`,
        onload:() => {
            renderer.zoomToFit()
        }
    })


})

