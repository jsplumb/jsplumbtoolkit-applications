
import {
    newInstance,
    ready,
    uuid,
    OrthogonalConnector,
    BlankEndpoint,
    DEFAULT, EVENT_TAP,
    EdgePathEditor,
    LassoPlugin,
    DrawingToolsPlugin,
    MiniviewPlugin,
    EVENT_CANVAS_CLICK,
    AbsoluteLayout,
    initializeOrthogonalConnectorEditors,
    BackgroundPlugin,
    SelectionModes,
    ShapeLibraryImpl, ShapeLibraryPalette, FLOWCHART_SHAPES, ControlsComponent
} from "@jsplumbtoolkit/browser-ui"

import edgeMappings from './edge-mappings'
import {
    CLASS_EDGE_LABEL,
    CLASS_FLOWCHART_EDGE,
    DEFAULT_STROKE,
    GRID_BACKGROUND_OPTIONS,
    GRID_SIZE,
    PROPERTY_COLOR,
    DEFAULT_TEXT_COLOR,
    PROPERTY_TEXT_COLOR,
    EDGE_TYPE_TARGET_ARROW,
    DEFAULT_FILL,
    PROPERTY_LINE_STYLE,
    PROPERTY_LABEL,
    DEFAULT_OUTLINE, DEFAULT_OUTLINE_WIDTH
} from "./constants";

import {FlowchartBuilderInspector} from "./flowchart-inspector";

// this call ensures that the esbuild does not tree-shake the orthogonal connector editors out.
initializeOrthogonalConnectorEditors()

const anchorPositions = [
    { x:0, y:0.5, ox:-1, oy:0, id:"left" },
    { x:1, y:0.5, ox:1, oy:0, id:"right" },
    { x:0.5, y:0, ox:0, oy:-1, id:"top" },
    { x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]

ready(() => {

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES]);
    let edgeEditor;
    let renderer;

    // get the various dom elements
    const mainElement = document.querySelector("#jtk-demo-flowchart"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview"),
        nodePaletteElement = mainElement.querySelector(".node-palette"),
        controlsElement = mainElement.querySelector(".jtk-controls-container"),
        inspectorElement = mainElement.querySelector(".inspector")

    // Declare an instance of the Toolkit and supply a beforeStartConnect interceptor, used
    // to provide an initial payload on connection drag.
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
    });

    // Instruct the toolkit to render to the 'canvas' element.
    //
    renderer = toolkit.render(canvasElement, {
        //
        // used in the vanilla demo to extract the text color from each object and set it on its DOM element in the template
        //
        templateMacros:{
            textColor:(data) => {
                return data[PROPERTY_TEXT_COLOR] || DEFAULT_TEXT_COLOR
            }
        },
        view: {
            nodes: {
                [DEFAULT]:{
                    // We have a single node type, which renders a div and uses the `jtk-shape` tag to inject appropriate SVG into
                    // the DOM element.  The `jtk-shape` tag is made available because we attach a `ShapeLibraryPalette` further down
                    // in the code here (see https://docs.jsplumbtoolkit.com/toolkit/6.x/shape-libraries).
                    // In this template we render a div for each value in the `anchorPositions` array, and these elements
                    // act as connection drag sources. We use CSS to position them, but we also write out various
                    // `data-jtk-anchor-...` properties to control their anchor positions.
                    template:`<div style="left:{{left}}px;top:{{top}}px;width:{{width}}px;height:{{height}}px;color:{{#textColor}}" class="flowchart-object flowchart-{{type}}" data-jtk-target="true">
                            <jtk-shape/>
                            <span>{{text}}</span> 
                            ${anchorPositions.map(ap => `<div class="jtk-connect jtk-connect-${ap.id}"  data-jtk-anchor-x="${ap.x}" data-jtk-anchor-y="${ap.y}" data-jtk-orientation-x="${ap.ox}"  data-jtk-orientation-y="${ap.oy}" data-jtk-source="true"></div>`).join("\n")}
                            <div class="node-delete node-action delete"/>
                        </div>`,
                    // target connections to this node can exist at any of the given anchorPositions
                    anchorPositions,
                    // node can support any number of connections.
                    maxConnections: -1,
                    events: {
                        [EVENT_TAP]: (params) => {
                            // cancel any edge edits when the user taps a node.
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
                    // Our edge uses a Blank endpoint and an Orthogonal connector.
                    endpoint:BlankEndpoint.type,
                    connector: {
                        type:OrthogonalConnector.type,
                        options:{
                            cornerRadius: 3,
                            alwaysRespectStubs:true
                        }
                    },
                    // we set a css class on the edge and also on its label
                    cssClass:CLASS_FLOWCHART_EDGE,
                    labelClass:CLASS_EDGE_LABEL,
                    // This says 'extract `label` from the edge data and use it as the edge's label'.
                    label:"{{label}}",
                    // a large outlineWidth helps with selection via the mouse.
                    outlineWidth:10,
                    events: {
                        click:(p) => {
                            // on edge click, select the edge (the inspector will update to
                            // show this edge), and start editing it.
                            // Note that we pass `anchorPositions` in to the edge editor to allow the user
                            // to relocate the source/target anchors.
                            toolkit.setSelection(p.edge)
                            edgeEditor.startEditing(p.edge, {
                                deleteButton:true,
                                anchorPositions
                            })
                        }
                    }
                }
            }
        },
        // We declare a set of edge mappings here: a mapping from some property's value to a set of
        // config for the edge such as overlays, css class.
        // see https://docs.jsplumbtoolkit.com/toolkit/6.x/property-mappings and `edge-mappings.js` for details.
        propertyMappings:{
            edgeMappings:edgeMappings()
        },
        // Layout the nodes using an absolute layout
        layout: {
            type: AbsoluteLayout.type
        },
        // Snap everything to a grid. This will be used for element dragging as well as resizing and also
        // by the palette that allows users to drag new nodes on to the canvas.
        grid:{
            size:GRID_SIZE
        },
        events: {
            // on whitespace click, clear selected node/edge and stop editing any edges.
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                edgeEditor.stopEditing()
            }
        },
        // this is mostly for dev: by default the surface will consume right clicks.
        consumeRightClick: false,
        // a selector identifying which parts of each node should not cause the element to be dragged.
        // typically here you'd list such things as buttons etc.
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        plugins:[
            // add a miniview plugin.
            {
                type: MiniviewPlugin.type,
                options: {
                    container: miniviewElement
                }
            },
            // this plugin allows the user to resize elements.
            {
                type:DrawingToolsPlugin.type,
                options:{
                    widthAttribute:"width",
                    heightAttribute:"height"
                }
            },
            // select multiple elements with a lasso
            {
                type:LassoPlugin.type,
                options: {
                    lassoInvert:true,
                    lassoEdges:true
                }
            },
            // use a grid background.
            {
                type:BackgroundPlugin.type,
                options:GRID_BACKGROUND_OPTIONS
            }
        ],
        modelEvents:[
            // catch the TAP event on the delete buttons inside nodes and remove the node from the model.
            {
                event:EVENT_TAP,
                selector:".node-delete",
                callback:(event, eventTarget, info) => {
                    toolkit.removeNode(info.obj)
                }
            }
        ]
    })

    // manager for editing edge paths
    edgeEditor = new EdgePathEditor(renderer, {activeMode: true})

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new ControlsComponent(controlsElement, renderer)

    // the palette displays a list of shapes that can be dragged on to the canvas
    new ShapeLibraryPalette ({
        container:nodePaletteElement,
        shapeLibrary,
        surface:renderer,
        dataGenerator:(el) => {
            return {
                textColor:DEFAULT_TEXT_COLOR,
                outline:DEFAULT_OUTLINE,
                fill:DEFAULT_FILL,
                outlineWidth:DEFAULT_OUTLINE_WIDTH
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

