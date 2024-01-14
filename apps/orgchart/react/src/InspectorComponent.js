import React, {useEffect, useRef, useState} from "react";

import { Inspector, Vertex } from "@jsplumbtoolkit/browser-ui"
import { getSurfaceComponent} from "@jsplumbtoolkit/browser-ui-react"

export default function InspectorComponent({surfaceId, onSelect}) {

    const container = useRef(null)
    const [current, setCurrent] = useState(null)
    const [inspector, setInspector] = useState(null)
    const [manager, setManager] = useState(null)
    const [reports, setReports] = useState([])

    const initialized = useRef(false)

    function getImage(person) {
        return `/avatars/${person.data.img}`
    }

    function selectPerson(p) {
        onSelect(p)
    }

    useEffect(() => {

        if (!initialized.current) {
            initialized.current = true
            getSurfaceComponent(surfaceId, surfaceComponentRef => {
                setInspector(new Inspector({
                    container: container.current,
                    surface:surfaceComponentRef.getSurface(),
                    renderEmptyContainer: () => {
                        setCurrent(null)
                        setManager(null)
                        setReports([])
                    },
                    refresh: (obj, cb) => {
                        setCurrent(obj)
                        setManager(obj.getTargetEdges().map(e => e.source)[0])
                        setReports(obj.getSourceEdges().map(e => e.target))
                        // next tick
                        setTimeout(cb)
                    }
                }))
            })
        }

    }, [])

    function renderPersonLink(person) {
        return <a className="jtk-orgchart-inspector-person" href="#" data-id={person.data.id} onClick={() => selectPerson(person)}>
                <img src={getImage(person)} alt={person.data.name}/>
                <div>
                    {person.data.name}
                    <span>{person.data.title}</span>
                </div>
                </a>
    }


    return <div ref={container}>

        {current== null && ''}

        {current != null &&
            <div className="jtk-orgchart-inspector">

                <h1>{current.data.name}</h1>
                <h2>{current.data.title}</h2>
                {reports.length > 0 && <>
                    <h5>Reports:</h5>
                    {reports.map(r => renderPersonLink(r))}

                </>}

                {manager != null && <>

                    <h5>Reports to:</h5>
                    {renderPersonLink(manager)}

                </>}

            </div>

        }

        </div>

}
