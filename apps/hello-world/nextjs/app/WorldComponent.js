import React from "react"

export default function HelloComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    return <div className="world-node">{vertex.data.label}</div>


}
