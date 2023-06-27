<template>
    <div style="width:100%;height:100%;display:flex">
        <div class="jtk-demo-canvas">
            <jsplumb-toolkit ref="toolkitComponent"
                             surface-id="surfaceId"
                             :render-params="this.renderParams()"
                             :view="this.viewParams()"
                             :toolkit-params="this.toolkitParams()"
                             url="schema-1.json"
            >

            </jsplumb-toolkit>
            <Controls surface-id="surfaceId"></Controls>
            <jsplumb-miniview surface-id="surfaceId"></jsplumb-miniview>
        </div>
        <div class="jtk-demo-rhs">
            <Palette surface-id="surfaceId"
                     selector="[data-type]"
                     v-bind:data-generator="dataGenerator">
            </Palette>
            <div id="inspector">
                <Inspector surface-id="surfaceId"></Inspector>
            </div>
            <div class="description">
                <p>This sample application is a builder for database schemas.</p>
            </div>
        </div>
    </div>
</template>
<script>

    import { defineComponent } from "vue";
    import { loadSurface } from "@jsplumbtoolkit/browser-ui-vue3"
    import {
        EVENT_TAP,
        DEFAULT,
        isPort, ForceDirectedLayout, DotEndpoint, LassoPlugin,
        AnchorLocations, StateMachineConnector, EVENT_CLICK, EVENT_CANVAS_CLICK,
        consume, LabelOverlay
    } from "@jsplumbtoolkit/browser-ui"

    import { edgeMappings, cardinalities, datatypes } from "../definitions";
    import { TABLE, VIEW, COLUMN, RELATIONSHIP, COLUMNS, COMMON } from "../constants";

    import TableComponent from "./TableComponent.vue";
    import Inspector from "./Inspector.vue";
    import Controls from './Controls.vue'
    import Palette from './Palette.vue'
    import ViewComponent from "./ViewComponent.vue";

    let toolkitComponent
    let toolkit
    let surface

    export default defineComponent({
        components: {Inspector, Controls, Palette},
        mounted() {

            toolkitComponent = this.$refs.toolkitComponent;

            loadSurface("surfaceId", (s) => {
                surface = s;
                toolkit = surface.toolkitInstance;
            })

        },
        methods:{
            toolkitParams:function() {
                return {
                    // the name of the property in each node's data that is the key for the data for the ports for that node.
                    // for more complex setups you can use `portExtractor` and `portUpdater` functions - see the documentation for examples.
                    portDataProperty:COLUMNS,

                    //
                    // set `cardinality` to be the first entry in the list by default.
                    beforeStartConnect:(source, type) => {
                        return {
                            cardinality:cardinalities[0].id
                        }
                    },

                    //
                    // Prevent connections from a column to itself or to another column on the same table.
                    //
                    beforeConnect:(source, target) => {
                        return isPort(source) && isPort(target) && source !== target && source.getParent() !== target.getParent()
                    }
                }
            },
            viewParams:function() {
                return {
                    nodes:{
                        [TABLE]: {
                            component:TableComponent
                        },
                        [VIEW]: {
                            component:ViewComponent
                        }
                    },
                    ports: {
                        [DEFAULT]: {
                            edgeType: COMMON, // the type of edge for connections from this port type
                            maxConnections: -1 // no limit on connections
                        }
                    },
                    edges:{
                        [DEFAULT]: {
                            detachable: false,
                            anchor: [AnchorLocations.Left, AnchorLocations.Right],
                            connector: StateMachineConnector.type,
                            cssClass: "jtk-schema-common-edge",
                            events: {
                                [EVENT_CLICK]: function(params) {
                                    // defaultPrevented is true when this was a delete edge click.
                                    if (!params.e.defaultPrevented) {
                                        toolkit.setSelection(params.edge)
                                    }
                                }
                            },
                            overlays: [
                                {
                                    type: LabelOverlay.type,
                                    options: {
                                        cssClass: "jtk-schema-delete-relationship",
                                        label: "x",
                                        events: {
                                            [EVENT_TAP]: function(params) {
                                                consume(params.e)
                                                toolkit.removeEdge(params.edge.id)
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    dragOptions: {
                        filter:[
                            "jtk-delete-button", "jtk-add-button", "jtk-schema-add"
                        ].join(",")
                    },
                    plugins:[
                        LassoPlugin.type
                    ],
                    propertyMappings:{
                        edgeMappings
                    },
                    events: {
                        [EVENT_CANVAS_CLICK]: function(e) {
                            toolkit.clearSelection()
                        }
                    },
                    zoomToFit:true,
                    layout:{
                        type: ForceDirectedLayout.type,
                        options: {
                            padding: {x:150, y:150}
                        }
                    },
                    defaults:{
                        endpoint:{
                            type:DotEndpoint.type,
                            options:{
                                cssClass:".jtk-schema-endpoint"
                            }
                        }
                    },
                    consumeRightClick:false
                }
            }
        },
        data:() => {
            return {
                edgeMappings:edgeMappings,
                dataGenerator:(el) => {
                    const type = el.getAttribute("data-type"),
                        base = {
                            name:el.getAttribute("data-type"),
                            type
                        };

                    if (type === TABLE) {
                        base.columns = []
                    } else {
                        base.query =''
                    }

                    return base
                }
            }
        }
    })
</script>
