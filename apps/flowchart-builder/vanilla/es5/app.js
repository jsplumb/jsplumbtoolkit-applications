/* -------------------- CONSTANTS ------------------------------ */

const EDGE_TYPE_SOURCE_ARROW = "sourceArrow"
const EDGE_TYPE_TARGET_ARROW = "targetArrow"
const EDGE_TYPE_BOTH_ARROWS = "bothArrows"
const EDGE_TYPE_PLAIN = "plain"
const EDGE_TYPE_DASHED = "dashed"

const PROPERTY_TEXT = "text"
const PROPERTY_LINE_STYLE = "lineStyle"
const PROPERTY_FILL = "fill"
const PROPERTY_LABEL = "label"
const PROPERTY_COLOR = "color"
const PROPERTY_TEXT_COLOR = "textColor"
const PROPERTY_OUTLINE = "outline"

const CLASS_EDGE_LABEL = "jtk-flowchart-edge-label"
const CLASS_DASHED_EDGE = "jtk-flowchart-dashed-edge"
const CLASS_FLOWCHART_EDGE = "jtk-flowchart-edge"

const ARROW_WIDTH = 20
const ARROW_LENGTH = 15

const TMPL_NODE_INSPECTOR = "tmplNodeInspector"
const TMPL_EDGE_INSPECTOR = "tmplEdgeInspector"

/**
 * Default fill color for shapes.
 */
const DEFAULT_FILL = "#FFFFFF"

/**
 * Default stroke color for edges
 */
const DEFAULT_STROKE = "#000000"

/**
 * Default text color
 */
const DEFAULT_TEXT_COLOR = "#000000"

/**
 * Default outline color for vertices
 */
const DEFAULT_OUTLINE = "#000000"

const DEFAULT_OUTLINE_WIDTH = 2

const GRID_SIZE = {
    w:50,
    h:50
}

const GRID_BACKGROUND_OPTIONS = {
    dragOnGrid:true,
    showGrid:true,
    showBorder:false,
    autoShrink:true,
    minWidth:10000,
    maxWidth:null,
    minHeight:10000,
    maxHeight:null,
    showTickMarks:false,
    type:jsPlumbToolkit.GeneratedGridBackground.type
}

/* ------------------------------------- EDGE MAPPINGS -------------------------------------- */

function edgeMappings(arrowWidth, arrowLength) {

    arrowWidth = arrowWidth || ARROW_WIDTH
    arrowLength = arrowLength || ARROW_LENGTH

    return [
        {
            property:PROPERTY_LINE_STYLE,
            mappings:{
                [EDGE_TYPE_SOURCE_ARROW]:{
                    overlays:[ { type:jsPlumbToolkit.ArrowOverlay.type, options:{location:0, direction:-1, width:arrowWidth, Length:arrowLength} } ]
                },
                [EDGE_TYPE_TARGET_ARROW]:{
                    overlays:[ { type:jsPlumbToolkit.ArrowOverlay.type, options:{location:1, width:arrowWidth, length:arrowLength} } ]
                },
                [EDGE_TYPE_BOTH_ARROWS]:{
                    overlays:[ {
                        type:jsPlumbToolkit.ArrowOverlay.type,
                        options:{
                            location:1,
                            width:arrowWidth,
                            length:arrowLength
                        }
                    }, {
                        type:jsPlumbToolkit.ArrowOverlay.type,
                        options:{
                            location:0,
                            direction:-1,
                            width:arrowWidth,
                            length:arrowLength
                        }
                    } ]
                },
                [EDGE_TYPE_PLAIN]:{},
                [EDGE_TYPE_DASHED]:{
                    cssClass:CLASS_DASHED_EDGE
                }
            }
        }
    ]

}

/* ------------------------------- INSPECTOR TEMPLATES ----------------------------------------- */



const inspectorTemplates = {
    [TMPL_NODE_INSPECTOR] : `
            <div class="jtk-inspector jtk-node-inspector">
                <div class="jtk-inspector-section">
                    <div>Text</div>
                    <input type="text" jtk-att="${PROPERTY_TEXT}" jtk-focus/>
                </div>
                
                <div class="jtk-inspector-section">
                    <div>Fill</div>
                    <input type="color" jtk-att="${PROPERTY_FILL}"/>
                </div>
                
                <div class="jtk-inspector-section">
                    <div>Color</div>
                    <input type="color" jtk-att="${PROPERTY_TEXT_COLOR}"/>
                </div>
                
                <div class="jtk-inspector-section">
                    <div>Outline</div>
                    <input type="color" jtk-att="${PROPERTY_OUTLINE}"/>
                </div>
                
            </div>`,
    [TMPL_EDGE_INSPECTOR] : `
            <div class="jtk-inspector jtk-edge-inspector">
                <div>Label</div>
                <input type="text" jtk-att="${PROPERTY_LABEL}"/>
                <div>Line style</div>
                <jtk-line-style value="{{lineStyle}}" jtk-att="${PROPERTY_LINE_STYLE}"></jtk-line-style>
                <div>Color</div>
                <input type="color" jtk-att="${PROPERTY_COLOR}"/>
            </div>`
}


/* -------------------------------- anchors ---------------------------- */

const anchorPositions = [
    { x:0, y:0.5, ox:-1, oy:0, id:"left" },
    { x:1, y:0.5, ox:1, oy:0, id:"right" },
    { x:0.5, y:0, ox:0, oy:-1, id:"top" },
    { x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]

/* ----------------------- flowchart builder ------------------------------ */

jsPlumbToolkit.ready(function() {
    const shapeLibrary = new jsPlumbToolkit.ShapeLibraryImpl([jsPlumbToolkit.FLOWCHART_SHAPES, jsPlumbToolkit.BASIC_SHAPES]);
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
    const toolkit = jsPlumbToolkit.newInstance({
        // set the Toolkit's selection mode to 'isolated', meaning it can select a set of edges, or a set of nodes, but it
        // cannot select a set of nodes and edges. In this demonstration we use an inspector that responds to events from the
        // toolkit's selection, so setting this to `isolated` helps us ensure we dont try to inspect edges and nodes at the same
        // time.
        selectionMode:jsPlumbToolkit.SelectionModes.isolated,
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
        shapes:{
            library:shapeLibrary,
            showLabels:true,
            labelAttribute:"text"
        },
        view: {
            nodes: {
                [jsPlumbToolkit.DEFAULT]:{
                    // We have a single node type, which renders a div and uses the `jtk-shape` tag to inject appropriate SVG into
                    // the DOM element.  The `jtk-shape` tag is made available because we attach a `ShapeLibraryPalette` further down
                    // in the code here (see https://docs.jsplumbtoolkit.com/toolkit/6.x/shape-libraries).
                    // In this template we render a div for each value in the `anchorPositions` array, and these elements
                    // act as connection drag sources. We use CSS to position them, but we also write out various
                    // `data-jtk-anchor-...` properties to control their anchor positions.
                    template:`<div style="color:{{#textColor}}" class="flowchart-object flowchart-{{type}}" data-jtk-target="true">
                            <jtk-shape/> 
                            ${anchorPositions.map(ap => `<div class="jtk-connect jtk-connect-${ap.id}"  data-jtk-anchor-x="${ap.x}" data-jtk-anchor-y="${ap.y}" data-jtk-orientation-x="${ap.ox}"  data-jtk-orientation-y="${ap.oy}" data-jtk-source="true"></div>`).join("\n")}
                            <div class="node-delete node-action delete"/>
                        </div>`,
                    // target connections to this node can exist at any of the given anchorPositions
                    anchorPositions,
                    // node can support any number of connections.
                    maxConnections: -1,
                    events: {
                        [jsPlumbToolkit.EVENT_TAP]: (params) => {
                            // cancel any edge edits when the user taps a node.
                            renderer.stopEditingPath()
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
                [jsPlumbToolkit.DEFAULT]: {
                    // Our edge uses a Blank endpoint and an Orthogonal connector.
                    endpoint:jsPlumbToolkit.BlankEndpoint.type,
                    connector: {
                        type:jsPlumbToolkit.OrthogonalConnector.type,
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
                            // show this edge), and start editing it
                            toolkit.setSelection(p.edge)
                            renderer.startEditingPath(p.edge, {
                                deleteButton:true
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
        // enable path editing
        editablePaths:true,
        // Layout the nodes using an absolute layout
        layout: {
            type: jsPlumbToolkit.AbsoluteLayout.type
        },
        // Snap everything to a grid. This will be used for element dragging as well as resizing and also
        // by the palette that allows users to drag new nodes on to the canvas.
        grid:{
            size:GRID_SIZE
        },
        events: {
            // on whitespace click, clear selected node/edge and stop editing any edges.
            [jsPlumbToolkit.EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                renderer.stopEditingPath()
            }
        },
        useModelForSizes:true,
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
                type: jsPlumbToolkit.MiniviewPlugin.type,
                options: {
                    container: miniviewElement
                }
            },
            // this plugin allows the user to resize elements.
            {
                type:jsPlumbToolkit.DrawingToolsPlugin.type,
                options:{
                    widthAttribute:"width",
                    heightAttribute:"height"
                }
            },
            // select multiple elements with a lasso
            {
                type:jsPlumbToolkit.LassoPlugin.type,
                options: {
                    lassoInvert:true,
                    lassoEdges:true
                }
            },
            // use a grid background.
            {
                type:jsPlumbToolkit.BackgroundPlugin.type,
                options:GRID_BACKGROUND_OPTIONS
            },
            jsPlumbToolkit.SnaplinesPlugin.type
        ],
        modelEvents:[
            // catch the TAP event on the delete buttons inside nodes and remove the node from the model.
            {
                event:jsPlumbToolkit.EVENT_TAP,
                selector:".node-delete",
                callback:(event, eventTarget, info) => {
                    toolkit.removeNode(info.obj)
                }
            }
        ]
    })

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new jsPlumbToolkit.ControlsComponent(controlsElement, renderer)

    // the palette displays a list of shapes that can be dragged on to the canvas
    new jsPlumbToolkit.ShapeLibraryPalette ({
        container:nodePaletteElement,
        shapeLibrary,
        initialSet:jsPlumbToolkit.FLOWCHART_SHAPES.id,
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

    const inspector = new jsPlumbToolkit.VanillaInspector({
        toolkit,
        container:inspectorElement,
        surface:renderer,
        templateResolver:(obj) => {
            if (jsPlumbToolkit.isNode(obj)) {
                return inspectorTemplates[TMPL_NODE_INSPECTOR]
            } else if (jsPlumbToolkit.isEdge(obj)) {
                return inspectorTemplates[TMPL_EDGE_INSPECTOR]
            }
        }
    })
    inspector.registerTag("jtk-line-style", jsPlumbToolkit.createEdgeTypePickerTag(toolkit, PROPERTY_LINE_STYLE, edgeMappings(), (v) => {
        this.setValue(PROPERTY_LINE_STYLE, v)
    }))

    // Load the data.
    toolkit.load({
        url: `./copyright.json?q=${jsPlumbToolkit.uuid()}`,
        onload:() => {
            renderer.zoomToFit()
        }
    })

    document.querySelector("#exportSvg").addEventListener("click", () => {
        const x = new jsPlumbToolkit.SvgExporterUI(renderer, shapeLibrary)
        x.export({margins: {x: 50, y: 50}})
    })

    document.querySelector("#exportPng").addEventListener("click", () => {
        // show an image export ui, which will default tp PNG.  `dimensions` is optional - if not supplied the resulting PNG
        // will have the same size as the content.
        const x = new jsPlumbToolkit.ImageExporterUI(renderer, shapeLibrary)
        x.export({margins: {x: 50, y: 50},
            dimensions:[
                { width:3000}, { width:1200}, {width:800}
            ]
        })
    })

    document.querySelector("#exportJpg").addEventListener("click", () => {
        // show an image export ui targetting a JPG output. Here we show an alternative to providing a list of dimensions - we just mandate the
        // width we want for the output. Again, this is optional. You don't need to provide this or `dimensions`. See note above.
        const x = new jsPlumbToolkit.ImageExporterUI(renderer, shapeLibrary)
        x.export({margins: {x: 50, y: 50}, type:"image/jpeg", width:3000})
    })
})
