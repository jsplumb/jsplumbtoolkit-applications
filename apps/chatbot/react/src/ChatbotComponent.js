import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import './chatbot.css'

import {
    newInstance,
    isPort,
    DEFAULT,
    AnchorLocations,
    BlankEndpoint,
    EVENT_CLICK,
    EVENT_TAP,
    uuid,
    AbsoluteLayout,
    PlainArrowOverlay
} from "@jsplumbtoolkit/browser-ui"

import {
    JsPlumbToolkitSurfaceComponent,
    JsPlumbToolkitMiniviewComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import { CHOICES,
    START,
    END,
    ACTION_CHOICE,
    ACTION_INPUT,
    ACTION_MESSAGE,
    ACTION_TEST,
    SELECTABLE
} from "./constants";

import StartComponent from './StartComponent'
import EndComponent from './EndComponent'
import MessageComponent from './MessageComponent'
import InputComponent from './InputComponent'
import ChoiceComponent from './ChoiceComponent'
import TestComponent from './TestComponent'
import Palette from './Palette'
import InspectorComponent from "./InspectorComponent";


export default function ChatbotComponent({ctx}) {

    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)
    const paletteContainer = useRef(null)
    const inspectorContainer = useRef(null)

    const toolkit = newInstance({
        // the name of the property in each node's data that is the key for the data for the ports for that node.
        // for more complex setups you can use `portExtractor` and `portUpdater` functions - see the documentation for examples.
        portDataProperty:CHOICES

    })

    const renderParams= {
        zoomToFit:true,
        consumeRightClick:false,
        defaults:{
            endpoint:BlankEndpoint.type,
            anchor:AnchorLocations.Continuous
        },
        layout:{
            type:AbsoluteLayout.type
        }
    }

    const view = {
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
                jsx: (ctx) => <StartComponent ctx={ctx}/>
            },
            [END]:{
                parent:SELECTABLE,
                    jsx: (ctx) => <EndComponent ctx={ctx}/>
            },
            [ACTION_MESSAGE]:{
                parent:SELECTABLE,
                    jsx: (ctx) => <MessageComponent ctx={ctx}/>
            },
            [ACTION_INPUT]:{
                parent:SELECTABLE,
                    jsx: (ctx) => <InputComponent ctx={ctx}/>
            },
            [ACTION_CHOICE]:{
                parent:SELECTABLE,
                    jsx: (ctx) => <ChoiceComponent ctx={ctx}/>
            },
            [ACTION_TEST]:{
                parent:SELECTABLE,
                    jsx: (ctx) => <TestComponent ctx={ctx}/>
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

    function dataGenerator(el) {
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
                message:"Test",
                choices:[
                    { id:"1", label:"Result 1"},
                    { id:"2", label:"Result 2"},
                ]
            })
        }

        return base
    }

    useEffect(() => {

        const cc = createRoot(controlsContainer.current)
        cc.render(<ControlsComponent surface={surfaceComponent.current.surface}/>)

        const pc = createRoot(paletteContainer.current)
        pc.render(<Palette
                surface={surfaceComponent.current.surface}
                dataGenerator={dataGenerator}
                selector=".jtk-chatbot-palette-item"
                container={paletteContainer.current}
                />)

        const i = createRoot(inspectorContainer.current)
        i.render(<InspectorComponent surface={surfaceComponent.current.surface}/>)

        const m = createRoot(miniviewContainer.current)
        m.render(<JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>)

        toolkit.load({
            url:`/dataset.json?q=${uuid()}`
        })
    }, [])


    return <div style={{width:"100%",height:"100%",display:"flex"}}>
<div className="jtk-demo-canvas">
        <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
    <div className="jtk-controls-container" ref={ controlsContainer }/>
    <div className="miniview" ref={ miniviewContainer }/>
    </div>
    <div className="jtk-demo-rhs">
        <div className="sidebar node-palette" ref={paletteContainer}/>
    <div id="inspector" ref={inspectorContainer}/>
    <div className="description">
        <p></p>
    </div>
    </div>
    </div>
}
