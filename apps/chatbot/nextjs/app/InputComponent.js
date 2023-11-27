'use client'

import React from "react"

export default function InputComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    return <div className="jtk-chatbot-input" data-jtk-target="true">
        <div className="jtk-delete" onClick={() => toolkit.removeNode(vertex)}></div>
    {vertex.data.message}
    <textarea rows="5" cols="10" placeholder={vertex.data.prompt}></textarea>
        <div className="connect" data-jtk-source="true"></div>
        </div>
}
