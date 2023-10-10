<script>
    import {
        AbsoluteLayout,
        newInstance,
        AnchorLocations,
        PlainArrowOverlay,
        BlankEndpoint,
        EVENT_TAP,
        SurfaceDropManager,
        MiniviewPlugin
    } from '@jsplumbtoolkit/browser-ui'

    import { ChatbotInspector} from './inspector'

    import { SurfaceComponent } from "@jsplumbtoolkit/browser-ui-svelte"
    import StartComponent from './components/start-component.svelte'
    import EndComponent from './components/end-component.svelte'
    import MessageComponent from './components/message-component.svelte'
    import ChoiceComponent from './components/choice-component.svelte'
    import TestComponent from './components/test-component.svelte'
    import InputComponent from './components/input-component.svelte'

    import {onMount} from "svelte"

    import { START, END, ACTION_MESSAGE, ACTION_INPUT, ACTION_CHOICE, ACTION_TEST, SELECTABLE } from './constants'

    let surfaceComponent

    const toolkit = newInstance({
        portDataProperty:"choices"
    })

    const renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        zoomToFit:true,
        consumeRightClick:false,
        defaults:{
            endpoint:BlankEndpoint.type,
            anchor:AnchorLocations.Continuous
        }
    }

    const viewParams = {
        nodes:{
            [SELECTABLE]:{
                events:{
                    [EVENT_TAP]:(p) => {
                        toolkit.setSelection(p.obj)
                    }
                }
            },
            [START]:{
                parent:SELECTABLE,
                component:StartComponent
            },
            [END]:{
                parent:SELECTABLE,
                component:EndComponent
            },
            [ACTION_MESSAGE]:{
                parent:SELECTABLE,
                component:MessageComponent
            },
            [ACTION_INPUT]:{
                parent:SELECTABLE,
                component:InputComponent
            },
            [ACTION_CHOICE]:{
                parent:SELECTABLE,
                component:ChoiceComponent
            },
            [ACTION_TEST]:{
                parent:SELECTABLE,
                component:TestComponent
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
                ],
                label:"{{label}}",
                events:{
                    [EVENT_TAP]:(p) => {
                        toolkit.setSelection(p.edge)
                    }
                }
            }
        },
        ports:{
            choice:{
                anchor:[AnchorLocations.Left, AnchorLocations.Right ]
            }
        }
    }

    onMount(async () => {

        const surface = surfaceComponent.getSurface()

        surface.addPlugin({
            type:MiniviewPlugin.type,
            options:{
                container:document.querySelector(".miniview")
            }
        })

        new SurfaceDropManager({
            surface,
            source: document.querySelector(".node-palette"),
            selector: ".jtk-chatbot-palette-item",
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
            }
        })

        new ChatbotInspector({
            toolkit,
            container:document.querySelector(".inspector"),
            surface
        })

        toolkit.load({
            url:"../dataset.json"
        })


    })

</script>

<div class="jtk-demo-main" id="jtk-demo-chatbot">

    <!-- main drawing area -->
    <div class="jtk-demo-canvas">

        <SurfaceComponent viewParams={viewParams} renderParams={renderParams} toolkit={toolkit} id="surface" bind:this={surfaceComponent}/>

      <!-- controls -->
        <div class="jtk-controls-container"></div>
      <!-- miniview -->
        <div class="miniview"></div>
    </div>
    <div class="jtk-demo-rhs">

      <!-- the node palette -->
        <div class="sidebar node-palette">
            <div class="jtk-chatbot-palette-item" data-type="start">
                start
            </div>
            <div class="jtk-chatbot-palette-item" data-type="end">
                end
            </div>
            <div class="jtk-chatbot-palette-item" data-type="message">
                message
            </div>
            <div class="jtk-chatbot-palette-item" data-type="input">
                input
            </div>
            <div class="jtk-chatbot-palette-item" data-type="choice">
                choice
            </div>
            <div class="jtk-chatbot-palette-item" data-type="test">
                test
            </div>
        </div>
      <!-- node/edge inspector -->
        <div class="inspector"></div>
    </div>


</div>

