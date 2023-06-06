import * as React from 'react'
import { useRef, useEffect } from 'react'

import {SurfaceMode} from "@jsplumbtoolkit/browser-ui"

export default function ControlsComponent({surface}) {

    const _container = useRef(null)
    const toolkit = surface.toolkitInstance

    useEffect(() => {
        surface.bind("mode", (mode) => {
            surface.removeClass(_container.current.querySelectorAll("[data-mode]"), "selected-mode");
            surface.addClass(_container.current.querySelectorAll("[data-mode='" + mode + "']"), "selected-mode");
        })
    })

    function reset() {
        toolkit.clearSelection()
        surface.zoomToFit()
    }

    function panMode() {
        surface.setMode(SurfaceMode.PAN)
    }

    function selectMode() {
        surface.setMode(SurfaceMode.SELECT)
    }

    function clear() {
        if (toolkit.getNodeCount() === 0 || window.confirm("Clear flowchart?")) {
            toolkit.clear()
        }
    }

    return <div ref={_container}>
        <i className="fa fa-arrows selected-mode" data-mode="pan" title="Pan Mode" onClick={() => panMode()}></i>
        <i className="fa fa-pencil" data-mode="select" title="Select Mode" onClick={() => selectMode()}></i>
        <i className="fa fa-home" data-reset title="Zoom To Fit" onClick={() => reset()}></i>
        <i className="fa fa-undo" data-undo="true" title="Undo last action" onClick={() => toolkit.undo()}></i>
        <i className="fa fa-repeat" data-redo="true" title="Redo last action" onClick={() => toolkit.redo()}></i>
        <i className="fa fa-times" title="Clear flowchart" onClick={() => clear()}></i>
    </div>
}
