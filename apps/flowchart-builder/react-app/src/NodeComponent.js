import * as React from 'react';

import { ShapeComponent } from "@jsplumbtoolkit/browser-ui-react"

export default function NodeComponent({ctx, shapeLibrary}) {

    const { vertex } = ctx;
    const data = vertex.data;

    return <div style={{width:data.width + 'px',height:data.height + 'px',color:data.textColor}} className="flowchart-object" data-jtk-target="true" data-jtk-target-port-type="target">
        <span>{data.text}</span>
        <ShapeComponent obj={data} shapeLibrary={shapeLibrary}/>
        <div className="jtk-connect" data-jtk-anchor-x="0" data-jtk-anchor-y="0.5" data-jtk-orientation-x="-1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style={{left:"0",top:"50%",transform: "translate(-50%, -50%)"}}></div>
        <div className="jtk-connect" data-jtk-anchor-x="1" data-jtk-anchor-y="0.5" data-jtk-orientation-x="1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style={{right:"0",top:"50%",transform: "translate(50%, -50%)"}}></div>
        <div className="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="0" data-jtk-orientation-x="0"  data-jtk-orientation-y="-1" data-jtk-source="true" data-jtk-port-type="source" style={{left:"50%",top:"0",transform: "translate(-50%, -50%)"}}></div>
        <div className="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="1" data-jtk-orientation-x="0"  data-jtk-orientation-y="1" data-jtk-source="true" data-jtk-port-type="source" style={{left:"50%",bottom:"0",transform: "translate(-50%, 50%)"}}></div>
        <div className="node-delete node-action delete"></div>
    </div>
}
