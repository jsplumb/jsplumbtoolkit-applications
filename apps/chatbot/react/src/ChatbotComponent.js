import React, { useEffect, useRef } from "react";

import './chatbot.css'

import {
    AnchorLocations,
    BlankEndpoint,
    EVENT_CLICK,
    EVENT_TAP,
    uuid,
    AbsoluteLayout,
    PlainArrowOverlay
} from "@jsplumbtoolkit/browser-ui"

import {
    SurfaceComponent,
    MiniviewComponent,
    ControlsComponent,
    SurfaceDropComponent
} from "@jsplumbtoolkit/browser-ui-react";

import {
    CHOICES,
    START,
    END,
    ACTION_CHOICE,
    ACTION_INPUT,
    ACTION_MESSAGE,
    ACTION_TEST,
    SELECTABLE, nodeTypes
} from "./constants";

import StartComponent from './StartComponent'
import EndComponent from './EndComponent'
import MessageComponent from './MessageComponent'
import InputComponent from './InputComponent'
import ChoiceComponent from './ChoiceComponent'
import TestComponent from './TestComponent'
import InspectorComponent from "./InspectorComponent";

const SURFACE_ID = "surface"

export default function ChatbotComponent({ctx}) {

    const surfaceComponent = useRef(null)
    const surface = useRef(null)
    const toolkit = useRef(null)

    const toolkitParams ={
        // the name of the property in each node's data that is the key for the data for the ports for that node.
        // for more complex setups you can use `portExtractor` and `portUpdater` functions - see the documentation for examples.
        portDataProperty:CHOICES
    }

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

        surface.current = surfaceComponent.current.getSurface()
        toolkit.current = surface.current.toolkitInstance
        toolkit.current.load({
            url:`/dataset.json?q=${uuid()}`
        })
    }, [])


    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <div className="jtk-demo-canvas">
            <SurfaceComponent surfaceId={SURFACE_ID}
                    renderParams={renderParams} toolkitParams={toolkitParams}
                    view={view} ref={ surfaceComponent }>

                <ControlsComponent/>
                <MiniviewComponent/>
            </SurfaceComponent>
        </div>
        <div className="jtk-demo-rhs">
            <div className="sidebar node-palette">
                <SurfaceDropComponent surfaceId={SURFACE_ID} dataGenerator={dataGenerator} selector=".jtk-chatbot-palette-item">
                    {nodeTypes.map(nt => <div key={nt.type} className="jtk-chatbot-palette-item" data-type={nt.type}>{nt.label}</div>)}
                </SurfaceDropComponent>

                <InspectorComponent surfaceId={SURFACE_ID}/>
                <div className="description"></div>
            </div>
        </div>
    </div>
}
