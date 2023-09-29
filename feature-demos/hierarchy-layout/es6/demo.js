
import {
    DEFAULT, AnchorLocations,
    BlankEndpoint,
    ready,
    newInstance,StraightConnector,
    HierarchyLayout
} from "@jsplumbtoolkit/browser-ui"

ready(() =>{

    const toolkit = newInstance();

    const mainElement = document.querySelector(".jtk-demo-main"),
        canvas1Element = mainElement.querySelector("#canvas1"),
        canvas2Element = mainElement.querySelector("#canvas2"),
        canvas3Element = mainElement.querySelector("#canvas3")

    const view = () => ({
        nodes: {
            [DEFAULT]: {
                template: `<div data-type="{{type}}">{{label}}</div>`
            }
        },
        edges: {
            [DEFAULT]: {
                connector: StraightConnector.type,
                endpoint: BlankEndpoint.type
            }
        }
    });

    toolkit.render(canvas1Element, {
        zoomToFit: true,
        view: view(),
        layout: {
            type: HierarchyLayout.type,
            options:{
                axis:"vertical"
            }
        },
        elementsDraggable:false,
        consumeRightClick:false,
        defaults:{
            anchor: { type:AnchorLocations.Continuous, options:{ faces:["left", "right"]} }
        }
    })

    toolkit.render(canvas2Element, {
        zoomToFit: true,
        view: view(),
        layout: {
            type: HierarchyLayout.type,
            options:{
                axis:"horizontal"
            }
        },
        elementsDraggable:false,
        consumeRightClick:false,
        defaults:{
            anchor: { type:AnchorLocations.Continuous, options:{ faces:["bottom", "top"]} }
        }
    })

    toolkit.render(canvas3Element, {
        zoomToFit: true,
        view: view(),
        layout: {
            type: HierarchyLayout.type,
            options:{
                axis:"horizontal",
                placementStrategy:"center"
            }
        },
        elementsDraggable:false,
        consumeRightClick:false,
        defaults:{
            anchor: { type:AnchorLocations.Continuous, options:{ faces:["bottom", "top"]} }
        }
    })

    toolkit.load({
        url:'./kpitree.json'
    })

})
