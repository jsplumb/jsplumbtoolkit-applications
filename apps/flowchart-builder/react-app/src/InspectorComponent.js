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

    { currentType === Node.objectType &&
        <div className="jtk-inspector jtk-node-inspector">
            <div>Text</div>
            <input type="text" jtk-att="text" jtk-focus="true"/>
            <div>Fill</div>
            <input type="color" jtk-att="fill"/>
            <div>Color</div>
            <input type="color" jtk-att="textColor"/>
            <div>Outline</div>
            <input type="color" jtk-att="outline"/>
        </div>
    }

    { currentType === Edge.objectType &&
        <div className="jtk-inspector jtk-edge-inspector">
            <div>Label</div>
            <input type="text" jtk-att="label"/>
            <div>Line style</div>
            <div>Color</div>
            <input type="color" jtk-att="color"/>
        </div>
    }

        </div>

}
