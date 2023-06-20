
import {
    ready,
    newInstance,
    DEFAULT,
    DotEndpoint,
    ForceDirectedLayout,
    EVENT_CANVAS_CLICK,
    LassoPlugin,
    VanillaSurfaceRenderOptions,
    StateMachineConnector,
    AnchorLocations,
    EVENT_TAP,
    Edge, LabelOverlay, consume, Vertex, isPort, ObjectData, EVENT_CLICK, SurfaceDropManager, SurfaceObjectInfo, Port
} from "@jsplumbtoolkit/browser-ui"

import { SchemaBuilderControls } from './controls'
import {cardinalities, Cardinality, Datatype, Relationship} from './definitions'
import {
    CLASS_SCHEMA_RELATIONSHIP_CARDINALITY,
    COLUMNS,
    COMMON,
    PROPERTY_CARDINALITY, TABLE
} from "./constants"
import {SchemaBuilderInspector} from "./schema-inspector"


//
// Create a set of edge mappings from the `cardinalities` array in definitions.ts. For each cardinality declared we
// add a mapping for the specific value, which has an overlay at each end showing the cardinality values.
// `cardinalityMappings` is passed to the render call, and the surface uses it to decide which overlays to show
// on a given edge.
const cardinalityMappings = {}
cardinalities.forEach(c => {
    cardinalityMappings[c.id] = {
        overlays:[
            { type:LabelOverlay.type, options:{ label:c.labels[0], location:0.1, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }},
            { type:LabelOverlay.type, options:{ label:c.labels[1], location:0.9, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }}
        ]
    }
})


ready(() => {

    const canvasElement = document.querySelector(".jtk-demo-canvas"),
        controlsElement = document.querySelector(".jtk-controls"),
        inspectorElement = document.getElementById("inspector"),
        paletteElement = document.getElementById("palette")

    const toolkit = newInstance({
        // the name of the property in each node's data that is the key for the data for the ports for that node.
        // for more complex setups you can use `portExtractor` and `portUpdater` functions - see the documentation for examples.
        portDataProperty:COLUMNS,

        //
        // set `cardinality` to be the first entry in the list by default.
        beforeStartConnect:(source: Vertex, type: string) => {
            return {
                cardinality:cardinalities[0].id
            }
        },

        //
        // Prevent connections from a column to itself or to another column on the same table.
        //
        beforeConnect:(source:Vertex, target:Vertex) => {
            return isPort(source) && isPort(target) && source !== target && source.getParent() !== target.getParent()
        },

        // /**
        //  * Set a name for newly dragged tables/views
        //  * @param type
        //  * @param data
        //  * @param continueCallback
        //  * @param abortCallback
        //  * @param params
        //  */
        // nodeFactory:(type: string, data: any, continueCallback: (o: ObjectData) => any, abortCallback: () => any, params?: any) => {
        //     data.name = type === TABLE ? "Table" : "View"
        //     continueCallback(data)
        //     return true
        // }

    })

    const renderParams:VanillaSurfaceRenderOptions = {
        dragOptions: {
            // filter:[
            //     `.${CLASS_VIEW} ${CLASS_BUTTONS}`,
            //     `.${CLASS_TABLE} ${CLASS_BUTTONS}`,
            //     `.${CLASS_TABLE_COLUMN} *`,
            //     `.${CLASS_VIEW_DELETE}`,
            //     `.${CLASS_EDIT_NAME}`,
            //     `.${CLASS_TABLE_COLUMN_EDIT}`,
            //     `.${CLASS_DELETE}`,
            //     `.${CLASS_NEW_COLUMN}`
            // ].join(",")
        },
        plugins:[
            LassoPlugin.type
        ],
        propertyMappings:{
            edgeMappings:[
                {
                    property:PROPERTY_CARDINALITY,
                    mappings:cardinalityMappings
                }
            ]
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e:Event) => {
                toolkit.clearSelection()
            }
        },
        zoomToFit:true,
        layout:{
            type: ForceDirectedLayout.type,
            options: {
                iterations:15,
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
        view:{
            nodes:{
                table:{
                    template:`<div class="jtk-schema-table jtk-schema-element">
                            <div class="jtk-schema-element-name">
                                <div class="jtk-schema-delete" title="Delete table"/>
                                <span>{{name}}</span>
                                <div class="jtk-schema-buttons">
                                    <div class="jtk-schema-edit-name jtk-schema-edit" title="Edit table name"/>
                                    <div class="jtk-schema-new-column jtk-schema-add" title="Add table column"/>
                                </div>
                            </div>
                            <div class="jtk-schema-columns">
                                <r-each in="columns" key="id">
                                    <r-tmpl id="tmplColumn"/>
                                </r-each>
                            </div>
                        </div>`
                },
                view:{
                    template:`<div class="jtk-schema-view jtk-schema-element">
                                <div class="jtk-schema-element-name">
                                    <div class="jtk-schema-view-delete jtk-schema-delete" title="Delete view"/>
                                    <span>{{name}}</span>
                                    <div class="jtk-schema-buttons">
                                        <div class="jtk-schema-edit-name jtk-schema-edit" title="Edit view name"/>                                            
                                    </div>
                                </div>            
                                <div class="jtk-schema-view-details">{{query}}</div>
                            </div>`
                }
            },
            ports: {
                [DEFAULT]: {
                    templateId: "tmplColumn",
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
                        [EVENT_CLICK]: (params: { edge: Edge, e:Event }) => {
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
                                    [EVENT_TAP]: (params: { edge: Relationship, e:Event }) => {
                                        consume(params.e)
                                        toolkit.removeEdge(params.edge.id)
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        templates:{
            tmplColumn:`<div class="jtk-schema-table-column" data-type="{{datatype}}" 
                                data-primary-key="{{primaryKey}}" data-jtk-port="{{id}}" data-jtk-scope="{{datatype}}" data-jtk-source="true" data-jtk-target="true">
                            <div class="jtk-schema-table-column-delete"/>
                            <div><span>{{name}}</span></div>
                            <div class="jtk-schema-table-column-edit jtk-schema-edit"/>
                        </div>`
        },
        modelEvents:[
            {
                event:EVENT_TAP,
                selector:".jtk-schema-edit-name",
                callback:(event: Event, eventTarget: HTMLElement, modelObject: SurfaceObjectInfo<Vertex>) => {
                    toolkit.setSelection(modelObject.obj)
                }
            },
            {
                event:EVENT_TAP,
                selector:".jtk-schema-table-column-edit",
                callback:(event: Event, eventTarget: HTMLElement, modelObject: SurfaceObjectInfo<Port>) => {
                    toolkit.setSelection(modelObject.obj)
                }
            }
        ]
    }

    const surface = toolkit.render(canvasElement, renderParams)

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new SchemaBuilderControls(controlsElement, toolkit, surface)

    new SurfaceDropManager({
        surface,
        source: paletteElement,
        selector: ".jtk-schema-palette-item",
        dataGenerator: (el: Element) => {
            const type = el.getAttribute("data-type")
            return {
                type,
                name:type,
                w: 120,
                h: 80
            }
        },
        allowDropOnEdge: false,
        allowDropOnNode: true,
        onVertexAdded:(v:Vertex):any => {
            toolkit.setSelection(v)
        }
    })

    const inspector = new SchemaBuilderInspector({
        surface,
        toolkit,
        container:inspectorElement
    })

    toolkit.load({
        url:'./schema-1.json'
    })
})