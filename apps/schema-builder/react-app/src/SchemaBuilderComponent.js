import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import './schema-builder.css'
import './theme.default.css'

import {
    newInstance,
    isPort,
    DEFAULT,
    AnchorLocations,
    StateMachineConnector,
    EVENT_CLICK,
    EVENT_TAP,
    LabelOverlay,
    consume,
    ForceDirectedLayout,
    LassoPlugin,
    EVENT_CANVAS_CLICK,
    DotEndpoint
} from "@jsplumbtoolkit/browser-ui"

import {
    JsPlumbToolkitSurfaceComponent,
    JsPlumbToolkitMiniviewComponent,
    ControlsComponent
} from "@jsplumbtoolkit/browser-ui-react";

import TableComponent from './TableComponent'
import ViewComponent from './ViewComponent'
import ColumnComponent from './ColumnComponent'

import { cardinalities, edgeMappings } from "./definitions";
import { COLUMNS, COMMON, TABLE} from "./constants";
import DragDropNodeSource from "./drag-drop-node-source";

export default function SchemaBuilderComponent() {

    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)
    const paletteContainer = useRef(null)

    function dataGenerator (el) {
        const type = el.getAttribute("data-type"),
            base = {
                name:el.getAttribute("data-type"),
                type
            };

        if (type === TABLE) {
            base.columns = []
        } else {
            base.query =''
        }

        return base

    }

    const toolkit = newInstance({
        // the name of the property in each node's data that is the key for the data for the ports for that node.
        // for more complex setups you can use `portExtractor` and `portUpdater` functions - see the documentation for examples.
        portDataProperty:COLUMNS,

        //
        // set `cardinality` to be the first entry in the list by default.
        beforeStartConnect:(source, type) => {
            return {
                cardinality:cardinalities[0].id
            }
        },

        //
        // Prevent connections from a column to itself or to another column on the same table.
        //
        beforeConnect:(source, target) => {
            return isPort(source) && isPort(target) && source !== target && source.getParent() !== target.getParent()
        }

    })

    const renderParams = {
        dragOptions: {
            filter:[
                "jtk-delete-button", "jtk-add-button", "jtk-schema-add"
            ].join(",")
        },
        plugins:[
            LassoPlugin.type
        ],
        propertyMappings:{
            edgeMappings
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
            }
        },
        zoomToFit:true,
        layout:{
            type: ForceDirectedLayout.type,
            options: {
                padding: {x:150, y:150}
            }
        },
        defaults:{
            endpoint:{
                type:DotEndpoint.type,
                options:{
                    cssClass:".jtk-schema-endpoint"
                }
            }
        },
        consumeRightClick:false
    }

    const view = {
        nodes:{
            "table": {
                jsx: (ctx) => <TableComponent ctx={ctx}/>
            },
            "view": {
                jsx: (ctx) => <ViewComponent ctx={ctx}/>
            }
        },
        ports: {
            [DEFAULT]: {
                jsx:(ctx) => { return <ColumnComponent ctx={ctx}/> },
                edgeType: COMMON, // the type of edge for connections from this port type
                maxConnections: -1 // no limit on connections
            }
        },
        edges:{
            [DEFAULT]: {
                detachable: false,
                anchor: [AnchorLocations.Left, AnchorLocations.Right],
                connector: StateMachineConnector.type,
                cssClass: "jtk-schema-common-edge",
                events: {
                    [EVENT_CLICK]: (params) => {
                        // defaultPrevented is true when this was a delete edge click.
                        if (!params.e.defaultPrevented) {
                            toolkit.setSelection(params.edge)
                        }
                    }
                },
                overlays: [
                    {
                        type: LabelOverlay.type,
                        options: {
                            cssClass: "jtk-schema-delete-relationship",
                            label: "x",
                            events: {
                                [EVENT_TAP]: (params) => {
                                    consume(params.e)
                                    toolkit.removeEdge(params.edge.id)
                                }
                            }
                        }
                    }
                ]
            }
        }
    }

    useEffect(() => {

        const cc = createRoot(controlsContainer.current)
        cc.render(<ControlsComponent surface={surfaceComponent.current.surface}/>)

        const m = createRoot(miniviewContainer.current)
        m.render(<JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>)

        const paletteRoot = createRoot(paletteContainer.current)
        paletteRoot.render(
            <DragDropNodeSource
                surface={surfaceComponent.current.surface}
                selector={"div"}
                container={paletteContainer.current}
                dataGenerator={dataGenerator}
            />)

        toolkit.load({
            url:'/schema-1.json'
        })

    }, [])

    return <div style={{width:"100%",height:"100%",display:"flex"}}>
            <div className="jtk-demo-canvas">
                <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
                <div className="jtk-controls-container" ref={ controlsContainer }/>
                <div className="miniview" ref={ miniviewContainer }/>
            </div>
            <div className="jtk-demo-rhs">
                <div id="palette" className="jtk-schema-palette" ref={paletteContainer}/>
                <div id="inspector"/>
                <div className="description">
                    <p>This sample application is a builder for database schemas.</p>
                </div>
            </div>
        </div>

}
