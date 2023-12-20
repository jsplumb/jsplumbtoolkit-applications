'use client'

import * as React from 'react';

import { ShapeComponent } from "@jsplumbtoolkit/browser-ui-react"

import { anchorPositions } from "./FlowchartComponent";

export default function NodeComponent({ctx, shapeLibrary}) {

    const { vertex, toolkit } = ctx;
    const data = vertex.data;

    return <div style={{color:data.textColor}} className="flowchart-object" data-jtk-target="true">

        <ShapeComponent obj={data} shapeLibrary={shapeLibrary} showLabels={true} labelProperty="text"/>

        {anchorPositions.map(ap => <div className={"jtk-connect jtk-connect-" + ap.id} data-jtk-anchor-x={ap.x} data-jtk-anchor-y={ap.y} data-jtk-orientation-x={ap.ox}  data-jtk-orientation-y={ap.oy} data-jtk-source="true" data-jtk-port-type="source" key={ap.id}></div>)}

        <div className="node-delete node-action delete" onClick={() => toolkit.removeNode(vertex)}></div>
    </div>
}
