import {
    newInstance,
    ready,
    HierarchyLayout,
    SegmentedConnector,
    AnchorLocations,
    BlankEndpoint,
    consume,
    EVENT_CLICK,
    EVENT_TAP,
    EVENT_CANVAS_CLICK
} from "@jsplumbtoolkit/browser-ui";

import tree from "../../italic"

import {ExpansionManager} from "./expansion-manager";
import { LanguageDetailsView } from "./language-details";

ready(() => {

    const tk = newInstance()

    let iframe = document.getElementById("ifDetails"),
        expansionManager, languageViewer, surface

    const surfaceOptions = {
        layout:{
            type:HierarchyLayout.type,
            options:{
                padding:{x:30, y:80}
            }
        },
        elementsDraggable:false,
        view:{
            nodes:{
                default:{
                    template:`<div data-link="{{link}}" data-family="{{family}}" data-extinct="{{extinct}}" data-collapsed="{{collapsed}}">                                    
                                    <r-if test="children != null">
                                        <span class="jtk-collapse">»</span>
                                    </r-if>
                                    <span class="jtk-label">{{#label}}</span>                                                                              
                                    </div>`,
                }
            }
        },
        defaults:{
            connector:SegmentedConnector.type,
            anchor:[AnchorLocations.Bottom, AnchorLocations.Top],
            endpoint:BlankEndpoint.type
        },
        templateMacros:{
            label:(data) => data.label || data.id
        },
        modelEvents:[
            {
                selector:".jtk-collapse",
                event:EVENT_TAP,
                callback:(e, el, info) => {
                    consume(e)
                    expansionManager.toggleNode(info.obj)
                }
            },
            {
                selector:".jtk-label",
                event:EVENT_TAP,
                callback:(e, el, info) => {
                    consume(e)
                    languageViewer.setCurrent(info)
                }
            }
        ],
        consumeRightClick:false,
        events:{
            [EVENT_CANVAS_CLICK]:() => languageViewer.clear()
        }
    }

    tk.load({
        data:tree,
        type:"hierarchical-json",
        onload:() => {
            expansionManager = new ExpansionManager(document.getElementById("canvas"), tk, surfaceOptions)
            surface = expansionManager.surface
            languageViewer = new LanguageDetailsView(iframe, surface, (link) => document.getElementById("container").setAttribute("data-details", link != null))

            surface.jsplumb.on(document.querySelector("[data-pan]"), EVENT_TAP, () => languageViewer.panToCurrent())
            surface.jsplumb.on(document.querySelector("[data-zoom]"), EVENT_TAP, () => surface.zoomToFit())
        }
    })



})
