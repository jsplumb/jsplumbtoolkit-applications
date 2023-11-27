'use client'

import React from "react"

export default function EndComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    return <div className="jtk-chatbot-end" data-jtk-target="true">
        <div className="jtk-delete" onClick={() => toolkit.removeNode(vertex)}></div>
        </div>
}
