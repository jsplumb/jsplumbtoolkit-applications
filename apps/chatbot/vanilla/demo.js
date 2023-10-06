import {
    newInstance,
    ready,
    AbsoluteLayout,
    SurfaceDropManager,
    BlankEndpoint,
    AnchorLocations,
    PlainArrowOverlay,
    EVENT_TAP, uuid,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui"

import { ChatbotInspector } from './inspector'


export const START = "start"
export const END = "end"
export const ACTION_MESSAGE = "message"
export const ACTION_INPUT = "input"
export const ACTION_CHOICE = "choice"
export const ACTION_TEST = "test"
const SELECTABLE = "selectable"

ready(() => {

    const canvas = document.querySelector(".jtk-demo-canvas")
    const palette = document.querySelector(".node-palette")
    const inspector = document.querySelector(".inspector")
    const controls = document.querySelector(".jtk-controls-container")

    const toolkit = newInstance({portDataProperty:"choices"})

    window.tk = toolkit

    const surface = toolkit.render(canvas, {
        layout:{
            type:AbsoluteLayout.type
        },
        view:{
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
                    template:`<div class="jtk-chatbot-start">
                        <div class="jtk-delete"></div> 
                        <div class="connect" data-jtk-source="true"/>
                    </div>`
                },
                [END]:{
                    parent:SELECTABLE,
                    template:`<div class="jtk-chatbot-end" data-jtk-target="true">
                        <div class="jtk-delete"></div>
                    </div>`
                },
                [ACTION_MESSAGE]:{
                    parent:SELECTABLE,
                    template:`<div class="jtk-chatbot-message" data-jtk-target="true">
                        <div class="jtk-delete"></div>
                        {{message}}
                        <div class="connect" data-jtk-source="true"/>
                        </div>`
                },
                [ACTION_INPUT]:{
                    parent:SELECTABLE,
                    template:`<div class="jtk-chatbot-input" data-jtk-target="true">
                        <div class="jtk-delete"></div>
                        {{message}}
                        <textarea rows="5" cols="10" placeholder="{{prompt}}"/>
                        <div class="connect" data-jtk-source="true"/>
                    </div>`
                },
                [ACTION_CHOICE]:{
                    parent:SELECTABLE,
                    template:`<div class="jtk-chatbot-choice" data-jtk-target="true">
                        <div class="jtk-delete"></div>
                        {{message}}
                        <div class="jtk-choice-add"></div>
                        <r-each in="choices" key="id">
                            <div class="jtk-chatbot-choice-option" 
                                 data-jtk-source="true" 
                                 data-jtk-port-type="choice"
                                 data-jtk-port="{{id}}">
                                 {{label}}
                                 <div class="jtk-choice-delete"></div>
                            </div>    
                        </r-each>
                    </div>`
                },
                [ACTION_TEST]:{
                    parent:SELECTABLE,
                    template:`<div class="jtk-chatbot-test" data-jtk-target="true">
                        <div class="jtk-delete"></div>
                        {{message}}
                        <div class="jtk-test-add"></div>
                        <r-each in="choices" key="id">
                            <div class="jtk-chatbot-choice-option" 
                                 data-jtk-source="true" 
                                 data-jtk-port-type="choice"
                                 data-jtk-port="{{id}}">
                                 {{label}}
                                 <div class="jtk-choice-delete"></div>
                            </div>    
                        </r-each>
                    </div>`
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
        },
        zoomToFit:true,
        consumeRightClick:false,
        defaults:{
            endpoint:BlankEndpoint.type,
            anchor:AnchorLocations.Continuous
        },
        modelEvents:[
            {
                event:EVENT_TAP,
                selector:".jtk-choice-add",
                callback:(event, eventTarget, modelObject) => {
                    toolkit.setSelection(toolkit.addPort(modelObject.obj, { id:uuid(), label:"Choice"}))
                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-test-add",
                callback:(event, eventTarget, modelObject) => {
                    toolkit.setSelection(toolkit.addPort(modelObject.obj, { id:uuid(), label:"Test"}))
                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-choice-delete",
                callback:(event, eventTarget, modelObject) => {
                    toolkit.removePort(modelObject.obj)
                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-chatbot-choice-option",
                callback:(event, eventTarget, modelObject) => {
                    toolkit.setSelection(modelObject.obj)
                }
            },
            {
                event:EVENT_TAP,
                selector:'.jtk-delete',
                callback:(event, eventTarget, modelObject) => {
                    toolkit.removeNode(modelObject.obj)
                }
            }
        ]
    })


    const dropManager = new SurfaceDropManager({
        surface,
        source: palette,
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
        container:inspector,
        surface
    })

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new ControlsComponent(controls, surface)

    toolkit.load({
        url:`./dataset.json?foo=${uuid()}`
    })

})

