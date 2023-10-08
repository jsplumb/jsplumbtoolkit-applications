<template>
    <div style="width:100%;height:100%;display:flex">
        <div class="jtk-demo-canvas">
            <jsplumb-toolkit ref="toolkitComponent"
                             surface-id="surfaceId"
                             :render-params="this.renderParams()"
                             :view="this.viewParams()"
                             :toolkit-params="this.toolkitParams()"
                             url="dataset.json"
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

            </div>
        </div>
    </div>
</template>
<script>

    import { defineComponent } from "vue";

    import { AbsoluteLayout, BlankEndpoint, EVENT_CANVAS_CLICK, DEFAULT, PlainArrowOverlay, AnchorLocations, EVENT_TAP } from "@jsplumbtoolkit/browser-ui"

    import MessageComponent from "./MessageComponent.vue";
    import InputComponent from "./InputComponent.vue";
    import StartComponent from "./StartComponent.vue";
    import EndComponent from "./EndComponent.vue";
    import ChoiceComponent from "./ChoiceComponent.vue";
    import TestComponent from "./TestComponent.vue";

    import Controls from './Controls.vue'
    import Palette from './Palette.vue'
    import Inspector from './Inspector.vue'

    import { START, END, ACTION_MESSAGE, ACTION_INPUT, ACTION_CHOICE, ACTION_TEST, SELECTABLE} from '../constants'

    let toolkitComponent
    let toolkit
    let surface

    export default defineComponent({
        name:"chatbot",
        components: {Controls, Palette, Inspector},
        mounted() {

            toolkitComponent = this.$refs.toolkitComponent;
            toolkit = toolkitComponent.toolkit;
            surface = toolkitComponent.surface;
        },
        methods:{
            viewParams:function() {
                return {
                    nodes: {
                        [SELECTABLE]: {
                            events: {
                                [EVENT_TAP]: (p) => {
                                    toolkit.setSelection(p.obj)
                                }
                            }
                        },
                        [START]: {
                            parent: SELECTABLE,
                            component: StartComponent
                        },
                        [ACTION_MESSAGE]: {
                            parent: SELECTABLE,
                            component: MessageComponent
                        },
                        [END]: {
                            parent: SELECTABLE,
                            component: EndComponent
                        },
                        [ACTION_INPUT]: {
                            parent: SELECTABLE,
                            component: InputComponent
                        },
                        [ACTION_CHOICE]: {
                            parent: SELECTABLE,
                            component: ChoiceComponent
                        },
                        [ACTION_TEST]: {
                            parent: SELECTABLE,
                            component: TestComponent
                        }

                    },
                    edges: {
                        default: {
                            overlays: [
                                {
                                    type: PlainArrowOverlay.type,
                                    options: {
                                        location: 1,
                                        width: 10,
                                        length: 10
                                    }
                                }
                            ],
                            label: "{{label}}",
                            events: {
                                [EVENT_TAP]: (p) => {
                                    toolkit.setSelection(p.edge)
                                }
                            }
                        }
                    },
                    ports: {
                        choice: {
                            anchor: [AnchorLocations.Left, AnchorLocations.Right]
                        }
                    }
                }
            },
            renderParams:function() {
                return {
                    consumeRightClick:false,
                    defaults:{
                        endpoint:BlankEndpoint.type,
                        anchor:AnchorLocations.Continuous
                    },
                    events: {
                        [EVENT_CANVAS_CLICK]: function(e) {
                            toolkit.clearSelection()
                        }
                    },
                    zoomToFit:true,
                    layout:{
                        type: AbsoluteLayout.type
                    }
                }
            },
            toolkitParams:function() {
                return {
                    portDataProperty:"choices"
                }
            }
        },
        data:() => {

            return {
                dataGenerator:(el) => {
                    const type = el.getAttribute("data-type")
                    const base = { type }
                    if (type === ACTION_MESSAGE) {
                        Object.assign(base, { message:"Send a message"})
                    } else if (type === ACTION_INPUT) {
                        Object.assign(base, { message:"Grab some input", prompt:"please enter input"})
                    } else if (type === ACTION_CHOICE) {
                        Object.assign(base, {
                            message:"Please choose:",
                            choices:[
                                { id:"1", label:"Choice 1"},
                                { id:"2", label:"Choice 2"},
                            ]
                        })
                    } else if (type === ACTION_TEST) {
                        Object.assign(base, {
                            message:"Apply test",
                            choices:[
                                { id:"1", label:"Result 1"},
                                { id:"2", label:"Result 2"},
                            ]
                        })
                    }

                    return base
                },

            }
        }
    })

</script>
