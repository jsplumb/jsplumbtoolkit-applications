<script>

    import ControlsComponent from './Controls.vue'
    import InspectorComponent from './Inspector.vue'
    import NodeComponent from './Node.vue'

    import {
        AbsoluteLayout,
        initializeOrthogonalConnectorEditors,
        EVENT_TAP,
        EdgePathEditor,
        FLOWCHART_SHAPES,
        BlankEndpoint,
        OrthogonalConnector,
        DEFAULT, findClosestPoint,
        EVENT_CANVAS_CLICK,
        DrawingToolsPlugin,
        LassoPlugin,
        BackgroundPlugin,
        ShapeLibraryImpl
    } from "@jsplumbtoolkit/browser-ui"

    import {
        CLASS_EDGE_LABEL,
        CLASS_FLOWCHART_EDGE, DEFAULT_FILL, DEFAULT_STROKE, DEFAULT_TEXT_COLOR, GRID_BACKGROUND_OPTIONS, GRID_SIZE
    } from "../constants";

    import edgeMappings from "../edge-mappings";

    let toolkitComponent
    let toolkit
    let surface
    let edgeEditor

    const shapeLibrary = new ShapeLibraryImpl([FLOWCHART_SHAPES])

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

    export default {
        name:"flowchart",
        components:{ ControlsComponent, InspectorComponent },
        mounted() {

            toolkitComponent = this.$refs.toolkitComponent;
            toolkit = toolkitComponent.toolkit;
            surface = toolkitComponent.surface;

            window.tk = toolkit

            edgeEditor = new EdgePathEditor(surface, { activeMode:true})

            initializeOrthogonalConnectorEditors()
        },
        data:() => {

            return {
                shapeLibrary,
                dataGenerator:(el) => {
                    return {
                        textColor:DEFAULT_TEXT_COLOR,
                        outline:DEFAULT_STROKE,
                        fill:DEFAULT_FILL,
                        text:'',
                        outlineWidth:2
                    }
                },
                toolkitParams:{},
                view:{
                    nodes:{
                        default:{
                            component:NodeComponent,
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
                                shapeLibrary:shapeLibrary
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
                renderParams:{
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
            }
        }
    }
</script>
<template>
    <div id="app">

        <ControlsComponent surface-id="surfaceId"/>

        <div class="jtk-demo-canvas">

            <jsplumb-toolkit ref="toolkitComponent"
                             surface-id="surfaceId"
                             v-bind:render-params="renderParams"
                             v-bind:view="view"
                             v-bind:toolkit-params="toolkitParams"
                             url="copyright.json"
            >

            </jsplumb-toolkit>

            <!-- miniview -->
            <jsplumb-miniview surface-id="surfaceId"></jsplumb-miniview>
        </div>
        <div class="jtk-demo-rhs">
            <!-- the node palette -->
            <div class="sidebar node-palette">
                <jsplumb-shape-palette surface-id="surfaceId"
                                       :shape-library="shapeLibrary"
                                       :data-generator="dataGenerator"/>
            </div>
            <!-- node/edge inspector -->
            <InspectorComponent surface-id="surfaceId"/>

            <div class="description">
                <p>
                    This sample application is a builder for flowcharts.
                </p>
            </div>
        </div>
    </div>
</template>
