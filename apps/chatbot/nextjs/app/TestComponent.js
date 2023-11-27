'use client'

import React from "react"

import {
    uuid
} from "@jsplumbtoolkit/browser-ui"

export default function TestComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    function addChoice(){
        toolkit.addPort(vertex, {
            id:uuid(),
            label:"Result"
        })
    }

    function removeChoice(id) {
        toolkit.removePort(vertex, id)
    }

    function inspectChoice(id) {
        toolkit.setSelection(vertex.getPort(id))
    }

    return <div className="jtk-chatbot-test" data-jtk-target="true">
        <div className="jtk-delete" onClick={() => toolkit.removeNode(vertex)}></div>
    {vertex.data.message}
<div className="jtk-choice-add" onClick={() => addChoice()}></div>
    {vertex.data.choices.map(c =>
    <div key={c.id}  className="jtk-chatbot-choice-option" data-jtk-source="true" data-jtk-port-type="choice" data-jtk-port={c.id} onClick={() => inspectChoice(c.id)}>
        {c.label}
    <div className="jtk-choice-delete" onClick={() => removeChoice(c.id)}></div>
        </div>

    )}
</div>

}
