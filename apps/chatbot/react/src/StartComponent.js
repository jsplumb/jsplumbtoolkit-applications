import React from "react"

export default function StartComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    return <div className="jtk-chatbot-start">
        <div className="jtk-delete" onClick={() => toolkit.removeNode(vertex)}></div>
        <div className="connect" data-jtk-source="true"></div>
        </div>
}
