import React from "react"

export default function MessageComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    return <div className="jtk-chatbot-message" data-jtk-target="true">
        <div className="jtk-delete" onClick={() => toolkit.removeNode(vertex)}></div>
    {vertex.data.message}
        <div className="connect" data-jtk-source="true"></div>
        </div>

}
