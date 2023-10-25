<script>

    import { AbsoluteLayout, BlankEndpoint,
        DEFAULT, AnchorLocations, ArrowOverlay, EVENT_CANVAS_CLICK
    } from "@jsplumbtoolkit/browser-ui"

    import { defineComponent } from "vue"

    import HelloComponent from './HelloComponent.vue'
    import WorldComponent from './WorldComponent.vue'

    let toolkitComponent
    let toolkit
    let surface

    export default defineComponent({
        name:"hello-world",
        mounted() {
            toolkitComponent = this.$refs.toolkitComponent;
            toolkit = toolkitComponent.toolkit;
            surface = toolkitComponent.surface;

            toolkit.load({
                data:{
                    nodes:[
                        { id:"1", type:"hello", label:"Hello", left:50, top:50 },
                        { id:"2", type:"world", label:"World", left:350, top:50 }
                    ],
                    edges:[
                        { source:"1", target:"2", data:{label:"a label", color:"purple"} }
                    ]
                }
            })
        },
        data:function() {
            return { msg:'' }
        },
        methods:{
            click:function(obj) {
                this.msg = `You clicked on node ${obj.id}`
            },
            view:function() {
                return {
                    nodes:{
                        clickable:{
                            events:{
                                tap:(p) => {
                                    this.click(p.obj)
                                    toolkit.setSelection(p.obj)
                                }
                            }
                        },
                        hello:{
                            parent:"clickable",
                            component:HelloComponent
                        },
                        world:{
                            parent:"clickable",
                            component:WorldComponent
                        }
                    },
                    edges:{
                        // a default edge definition. Declares an arrow overlay at its tip and extracts 'label' from
                        // edge data and displays it as a label overlay (by default at location 0.5)
                        [DEFAULT]:{
                            overlays:[
                                {
                                    type:ArrowOverlay.type,
                                    options:{
                                        location: 1
                                    }
                                }
                            ],
                            label:"{{label}}"
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    layout:{
                        // there are several layouts that ship with the toolkit.
                        type:AbsoluteLayout.type,
                        options:{
                            //... if your chosen layout is configurable, options go here
                        }
                    },
                    // Allows us to specify edge color (and line width) in each edge's backing data
                    simpleEdgeStyles:true,
                    // Use a Continuous anchor and a blank endpoint by default.
                    defaults:{
                        anchor:AnchorLocations.Continuous,
                        endpoint:BlankEndpoint.type
                    },
                    events:{
                        [EVENT_CANVAS_CLICK]:() => {
                            toolkit.clearSelection()
                            this.msg = ''
                        }
                    }
                }
            }
        }
    })

</script>

<template>

    <div id="container">
        <div class="msg">{{msg}}</div>
    <jsplumb-toolkit ref="toolkitComponent"
                     surface-id="surfaceId"
                     v-bind:render-params="this.renderParams()"
                     v-bind:view="this.view()">

    </jsplumb-toolkit>

    </div>

</template>

<style scoped="true">
    .msg {
        position:absolute;
        left:1rem;
        top:1rem;
    }
</style>

