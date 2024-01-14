import React, { useEffect, useRef } from "react";

import './schema-builder.css'
import './theme.default.css'

import {
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
    SurfaceComponent,
    MiniviewComponent,
    ControlsComponent,
    SurfaceDropComponent
} from "@jsplumbtoolkit/browser-ui-react";

import Inspector from './InspectorComponent'
import TableComponent from './TableComponent'
import ViewComponent from './ViewComponent'
import ColumnComponent from './ColumnComponent'

import { cardinalities, edgeMappings } from "./definitions";
import { COLUMNS, COMMON, TABLE} from "./constants";

const SURFACE_ID = "surfaceId"

export default function SchemaBuilderComponent() {

    const surfaceComponent = useRef(null)
    const toolkit = useRef(null)

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

    const toolkitParams = {
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

    }

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
                toolkit.current.clearSelection()
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
                            toolkit.current.setSelection(params.edge)
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
                                    toolkit.current.removeEdge(params.edge.id)
                                }
                            }
                        }
                    }
                ]
            }
        }
    }

    useEffect(() => {

        toolkit.current = surfaceComponent.current.getToolkit()

        toolkit.current.load({
            url:'/schema-1.json'
        })

    }, [])

    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <div className="jtk-demo-canvas">
            <SurfaceComponent renderParams={renderParams} toolkitParams={toolkitParams} view={view} ref={ surfaceComponent } surfaceId={SURFACE_ID}>
                <ControlsComponent/>
                <MiniviewComponent/>
            </SurfaceComponent>
        </div>
        <div className="jtk-demo-rhs">
            <div className="jtk-schema-palette">
                <SurfaceDropComponent surfaceId={SURFACE_ID} selector={"div"} dataGenerator={dataGenerator}>
                    <div data-type="table" title="Drag to add new" className="jtk-schema-palette-item" key={"table"}>Table</div>
                    <div data-type="view" title="Drag to add new" className="jtk-schema-palette-item" key={"view"}>View</div>
                </SurfaceDropComponent>

                <Inspector surfaceId={SURFACE_ID}/>

                <div className="description">
                    <p>This sample application is a builder for database schemas.</p>
                </div>
            </div>
        </div>
    </div>

}
