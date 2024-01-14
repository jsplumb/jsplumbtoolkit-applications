<script>

    import ControlsComponent from './Controls.vue'
    import InspectorComponent from './Inspector.vue'
    import NodeComponent from './Node.vue'

    import { defineComponent } from "vue";

    import {
        AbsoluteLayout,
        initializeOrthogonalConnectorEditors,
        EVENT_TAP,
        EdgePathEditor,
        FLOWCHART_SHAPES, BASIC_SHAPES,
        BlankEndpoint,
        OrthogonalConnector,
        DEFAULT, findClosestPoint,
        EVENT_CANVAS_CLICK,
        DrawingToolsPlugin,
        LassoPlugin,
        BackgroundPlugin,
        ShapeLibraryImpl,
        SelectionModes,
        SvgExporterUI,
        ImageExporterUI

    } from "@jsplumbtoolkit/browser-ui"

    import { loadSurface } from "@jsplumbtoolkit/browser-ui-vue3"

    import {
        CLASS_EDGE_LABEL,
        CLASS_FLOWCHART_EDGE,
        DEFAULT_FILL,
        DEFAULT_STROKE,
        DEFAULT_TEXT_COLOR, EDGE_TYPE_TARGET_ARROW,
        GRID_BACKGROUND_OPTIONS,
        GRID_SIZE, PROPERTY_COLOR,
        PROPERTY_LABEL, PROPERTY_LINE_STYLE
    } from "../constants";

    import edgeMappings from "../edge-mappings";

    let toolkit
    let surface
    let edgeEditor

    let foo

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES, BASIC_SHAPES])

    export const anchorPositions = [
        {x:0, y:0.5, ox:-1, oy:0, id:"left"},
        {x:1, y:0.5, ox:1, oy:0, id:"right"},
        {x:0.5, y:0, ox:0, oy:-1, id:"top"},
        {x:0.5, y:1, ox:0, oy:1, id:"bottom"}
    ]

    export default defineComponent({
        name:"flowchart",
        components:{ ControlsComponent, InspectorComponent },
        mounted() {

            loadSurface("surfaceId", (s) => {
                surface = s;
                toolkit = surface.toolkitInstance;

                window.tk = toolkit

                edgeEditor = new EdgePathEditor(surface, { activeMode:true})

                initializeOrthogonalConnectorEditors()

            })


        },
        methods:{
            toolkitParams:function() {
                return {
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
            },
            viewParams:function() {
                return {
                    nodes:{
                        default:{
                            component:NodeComponent,
                            // target connections to this node can exist at any of the given anchorPositions
                            anchorPositions,
                            // node can support any number of connections.
                            maxConnections: -1,
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
                            },
                            inject:{
                                shapeLibrary:shapeLibrary,
                                anchorPositions:anchorPositions
                            }
                        }
                    },
                    edges: {
                        [DEFAULT]: {
                            endpoint:BlankEndpoint.type,
                            connector: {
                                type:OrthogonalConnector.type,
                                options:{
                                    //cornerRadius: 3,
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
                                        deleteButton:true
                                    })
                                }
                            }
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    layout:{
                        type:AbsoluteLayout.type
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
                    propertyMappings:{
                        edgeMappings:edgeMappings()
                    },
                    useModelForSizes:true,
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
            },
            exportSvg:function() {
                new SvgExporterUI(surface, shapeLibrary).export({})
            },
            exportPng:function() {
                // show an image export ui, which will default tp PNG.  `dimensions` is optional - if not supplied the resulting PNG
                // will have the same size as the content.
                new ImageExporterUI(surface, shapeLibrary).export({
                    dimensions:[
                        { width:3000}, { width:1200}, {width:800}
                    ]})
            },
            exportJpg:function() {
                // show an image export ui targetting a JPG output. Here we show an alternative to providing a list of dimensions - we just mandate the
                // width we want for the output. Again, this is optional. You don't need to provide this or `dimensions`. See note above.
                new ImageExporterUI(surface, shapeLibrary).export({type:"image/jpeg", width:3000})
            }
        },
        data:() => {
            return {
                edgeMappings:edgeMappings(),
                shapeLibrary,
                dataGenerator:(el) => {
                    return {
                        textColor:DEFAULT_TEXT_COLOR,
                        outline:DEFAULT_STROKE,
                        fill:DEFAULT_FILL,
                        text:'',
                        outlineWidth:2
                    }
                }
            }
        }
    })
</script>
<template>
    <div id="app">

        <ControlsComponent surface-id="surfaceId"/>

        <div class="jtk-export" ref="foo">
            <span>Export:</span>
            <a href="#" id="exportSvg" v-on:click="exportSvg()">SVG</a>
            <a href="#" id="exportPng" v-on:click="exportPng()">PNG</a>
            <a href="#" id="exportJpg" v-on:click="exportJpg()">JPG</a>
        </div>

        <div class="jtk-demo-canvas">

            <jsplumb-toolkit surface-id="surfaceId"
                             :render-params="this.renderParams()"
                             :view="this.viewParams()"
                             :toolkit-params="this.toolkitParams()"
                             url="copyright.json">
            </jsplumb-toolkit>

            <!-- miniview -->
            <jsplumb-miniview surface-id="surfaceId"></jsplumb-miniview>
        </div>
        <div class="jtk-demo-rhs">
            <!-- the node palette-->
            <div class="sidebar node-palette">
                <jsplumb-shape-palette surface-id="surfaceId"
                                       :shape-library="shapeLibrary"
                                       :data-generator="dataGenerator"
                initial-set="flowchart"/>
            </div>

            <!-- node/edge inspector -->
            <InspectorComponent surface-id="surfaceId" v-bind:edge-mappings="edgeMappings"/>

            <div class="description">
                <p>
                    This sample application is a builder for flowcharts.
                </p>
            </div>
        </div>
    </div>
</template>
