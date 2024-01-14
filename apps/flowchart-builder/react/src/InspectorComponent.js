import React, {useEffect, useRef, useState} from "react";

import { Node, Edge, Inspector} from "@jsplumbtoolkit/browser-ui"
import { EdgeTypePickerComponent, getSurfaceComponent } from "@jsplumbtoolkit/browser-ui-react";

/**
 * Node/edge inspector for the flowchart. In a `useEffect` we call `getSurfaceComponent` from the Toolkit's global
 * react context, with the id of the surface component we want to attach to (that id is passed in as a prop by the
 * flowchart component).  In the callback we create a new `Inspector`, passing it a "container" corresponding to the
 * DOM element into which this component has been rendered.  In the `refresh` method we extract the `objectType` of
 * the object to be inspected, which will cause the UI for this component to re-render. On the next tick of the event
 * loop we invoke the callback that was passed to `refresh`, which indicates to the Inspector that the UI has been updated
 * and that it should now populate it.
 *
 * We don't have to handle updates from the inspector; the inspector does that itself, as well as ensuring that it stays
 * in sync with other changes in the Toolkit such as the removal of the currently inspected object, undo/redo etc.
 *
 * @param surfaceId
 * @param edgeMappings
 * @constructor
 */
export default function InspectorComponent({surfaceId, edgeMappings}) {

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
                        setCurrentType(obj.objectType)
                        // next tick
                        setTimeout(cb)
                    }
                }))
            })
        }

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
            <EdgeTypePickerComponent edgeMappings={edgeMappings} propertyName="lineStyle" inspector={inspector}/>
            <div>Color</div>
            <input type="color" jtk-att="color"/>
        </div>
    }

        </div>

}
