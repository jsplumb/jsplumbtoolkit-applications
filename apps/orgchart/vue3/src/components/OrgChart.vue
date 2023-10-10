<template>
    <div style="width:100%;height:100%;display:flex">
        <div class="jtk-demo-canvas">
            <jsplumb-toolkit ref="toolkitComponent"
                             surface-id="surfaceId"
                             :render-params="this.renderParams()"
                             :view="this.viewParams()"
                             url="dataset.json"
            >

            </jsplumb-toolkit>
            <jsplumb-miniview surface-id="surfaceId"></jsplumb-miniview>
        </div>
        <div class="jtk-demo-rhs">
            <div id="inspector">
                <Inspector surface-id="surfaceId" v-bind:selectPerson="selectPerson"></Inspector>
            </div>
            <div class="description">

            </div>
        </div>
    </div>
</template>
<script>

    import {defineComponent } from "vue"

    import { HierarchyLayout, BlankEndpoint, EVENT_CANVAS_CLICK, DEFAULT, PlainArrowOverlay, AnchorLocations, EVENT_TAP } from "@jsplumbtoolkit/browser-ui"

    import PersonComponent from "./PersonComponent.vue";
    import Inspector from './Inspector.vue'

    let toolkitComponent
    let toolkit
    let surface

    export default defineComponent({
        name:"orgchart",
        components: {Inspector},
        mounted() {

            toolkitComponent = this.$refs.toolkitComponent;
            toolkit = toolkitComponent.toolkit;
            surface = toolkitComponent.surface;
        },
        methods:{
            selectPerson:function(p) {
                toolkit.setSelection(p)
                surface.centerOnAndZoom(p, 0.15)
            },
            viewParams:function() {
                return {
                    nodes:{
                        [DEFAULT]:{
                            events:{
                                [EVENT_TAP]:(p) => {
                                    this.selectPerson(p.obj)
                                }
                            },
                            component:PersonComponent
                        }

                    },
                    edges:{
                        default:{
                            overlays:[
                                {
                                    type:PlainArrowOverlay.type,
                                    options:{
                                        location:1,
                                        width:10,
                                        length:10
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    consumeRightClick:false,
                    elementsDraggable:false,
                    defaults:{
                        endpoint:BlankEndpoint.type,
                        anchor:AnchorLocations.ContinuousTopBottom
                    },
                    events: {
                        [EVENT_CANVAS_CLICK]: function(e) {
                            toolkit.clearSelection()
                        }
                    },
                    zoomToFit:true,
                    layout:{
                        type: HierarchyLayout.type
                    }
                }
            }
        }
    })

</script>
