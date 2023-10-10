import {
    newInstance,
    ready,
    HierarchyLayout,
    SurfaceDropManager,
    BlankEndpoint,
    AnchorLocations,
    PlainArrowOverlay,
    EVENT_TAP, uuid,
    ControlsComponent,
    DEFAULT,
    MiniviewPlugin
} from "@jsplumbtoolkit/browser-ui"

import { OrgchartInspector } from './inspector'


ready(() => {

    const canvas = document.querySelector(".jtk-demo-canvas")
    const inspector = document.querySelector(".inspector")
    const controls = document.querySelector(".jtk-controls-container")

    const toolkit = newInstance()

    window.tk = toolkit

    function selectPerson(id) {
        toolkit.setSelection(id)
        surface.centerOnAndZoom(id, 0.15)
    }

    const surface = toolkit.render(canvas, {
        layout:{
            type:HierarchyLayout.type
        },
        view:{
            nodes:{
                [DEFAULT]:{
                    template:`<div>
                        <img src="avatars/{{img}}" alt="{{name}}"/>
                        <div>
                            <strong>{{name}}</strong>
                            <span>{{title}}</span>
                        </div>
                        </div>`,
                    events:{
                        [EVENT_TAP]:(p) => {
                            // set the tapped person as the current selection, which will make them
                            // appear in the inspector.
                            //toolkit.setSelection(p.obj)
                            // center on the tapped person and zoom the display
                            //surface.centerOnAndZoom(p.obj, 0.15)
                            //const s = toolkit.selectDescendants(p.obj)
                            selectPerson(p.obj.id)

                        }
                    }
                }
            },
            edges:{
                default:{
                    overlays:[
                        {
                            type:PlainArrowOverlay.type,
                            options:{
                                location:1,
                                width:10,
                                length:10
                            }
                        }
                    ]
                }
            }
        },
        zoomToFit:true,
        consumeRightClick:false,
        elementsDraggable:false,
        defaults:{
            endpoint:BlankEndpoint.type,
            anchor:AnchorLocations.ContinuousTopBottom
        },
        plugins:[
            {
                type:MiniviewPlugin.type,
                options:{
                    container:document.querySelector(".miniview")
                }
            }
        ]
    })
    new OrgchartInspector({
        toolkit,
        container:inspector,
        surface,
        onPersonSelected:selectPerson
    })

    // handler for mode change (pan/zoom vs lasso), clear dataset, zoom to fit etc.
    new ControlsComponent(controls, surface)

    toolkit.load({
        url:`./dataset.json?foo=${uuid()}`
    })

})

