import React, {useEffect, useRef, useState} from "react";

import { Node, Edge, Inspector} from "@jsplumbtoolkit/browser-ui"

export default function InspectorComponent({surface}) {

    const container = useRef(null)
    const [currentType, setCurrentType] = useState('')

    useEffect(() => {

        new Inspector({
            container:container.current,
            surface,
            _renderEmptyContainer:() => setCurrentType(''),
            _refresh:(obj, cb) => {
                setCurrentType(obj.objectType)
                // next tick
                setTimeout(cb)
            }
        })

    })

    return <div ref={container}>

        {currentType === '' &&
            <h1>not set</h1>
        }

    { currentType === Node.objectType &&
        <div className="jtk-inspector jtk-node-inspector">
            <div className="jtk-inspector-section">
            <div>Text</div>
                <input type="text" jtk-att="text" jtk-focus/>
            </div>

            <div className="jtk-inspector-section">
                <div>Fill</div>
                <input type="color" jtk-att="fill"/>
            </div>

            <div className="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="textColor"/>
            </div>

            <div className="jtk-inspector-section">
                <div>Outline</div>
                <input type="color" jtk-att="outline"/>
            </div>
        </div>
    }

    { currentType === Edge.objectType &&
        <div className="jtk-inspector jtk-edge-inspector">
            <div className="jtk-inspector-section">
                <div>Label</div>
                <input type="text" jtk-att="label"/>
            </div>
            <div className="jtk-inspector-section">
                <div>Line style</div>
            </div>
            <div className="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="color"/>
            </div>
        </div>
    }

        </div>

}
