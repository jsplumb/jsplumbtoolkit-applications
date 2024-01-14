import React, {useEffect, useRef, useState} from "react";

import { Inspector, isNode, isPort} from "@jsplumbtoolkit/browser-ui"
import { getSurfaceComponent } from "@jsplumbtoolkit/browser-ui-react";

import {
ACTION_TEST, ACTION_MESSAGE, ACTION_CHOICE, ACTION_INPUT, START, END
} from "./constants";

const CHOICE_PORT="choicePort"
const EDGE = "edge"

export default function InspectorComponent({surfaceId}) {

    const initialized = useRef(false)
    const container = useRef(null)
    const [currentType, setCurrentType] = useState('')
    const [inspector, setInspector] = useState(null)

    useEffect(() => {

        if (!initialized.current) {
            initialized.current = true
            getSurfaceComponent(surfaceId, surfaceComponentRef => {
                setInspector(new Inspector({
                    container: container.current,
                    surface: surfaceComponentRef.getSurface(),
                    renderEmptyContainer: () => setCurrentType(''),
                    refresh: (obj, cb) => {
                        const ct = isNode(obj) ? obj.data.type : isPort(obj) ? CHOICE_PORT : EDGE
                        setCurrentType(ct)
                        // next tick
                        setTimeout(cb)
                    }
                }))
            })
        }

    }, [])

    function baseActionTemplate() {
        return <div className="jtk-chatbot-inspector">
            <span>Message:</span>
        <input type="text" jtk-att="message" placeholder="message"/>
            </div>
    }

    return <div ref={container}>

            { currentType === '' && <div/>}
            { currentType === START && <div/>}
            { currentType === END && <div/>}

            { currentType === ACTION_MESSAGE  &&  baseActionTemplate()}
            { currentType === ACTION_CHOICE &&  baseActionTemplate()}
            { currentType === ACTION_TEST &&  baseActionTemplate()}

            { currentType === ACTION_INPUT &&
            <div className="jtk-chatbot-inspector">
                <span>Message:</span>
                <input type="text" jtk-att="message" placeholder="message"/>
                <span>Prompt:</span>
                <input type="text" jtk-att="prompt" placeholder="prompt"/>
                </div>
            }

    { currentType === CHOICE_PORT &&
        <div className="jtk-chatbot-inspector">
            <span>Label:</span>
            <input type="text" jtk-att="label" jtk-focus placeholder="enter label..."/>
        </div>

    }

    { currentType === EDGE &&
    <div className="jtk-chatbot-inspector">
        <div>Label</div>
        <input type="text" jtk-att="value"/>
        </div>
    }


        </div>

}
