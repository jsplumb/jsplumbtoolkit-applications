
import {
    EVENT_TAP,
    EVENT_CLICK,
    EVENT_SURFACE_MODE_CHANGED,
    EVENT_CANVAS_CLICK,
    BlankEndpoint,
    ArrowOverlay,
    AnchorLocations,
    DEFAULT,
    ready,
    newInstance,
    Group,
    EVENT_GROUP_ADDED,
    AbsoluteLayout,
    EVENT_UNDOREDO_UPDATE,
    createSurfaceDropManager,
    ForceDirectedLayout,
    MiniviewPlugin,
    StateMachineConnector,
    LassoPlugin} from "@jsplumbtoolkit/browser-ui"

ready(() => {


// jsPlumbToolkit code.

    // 1. declare some JSON data for the graph. This syntax is a JSON equivalent of GraphML.
    const data = {
        "groups":[
            {"id":"one", "title":"Group 1", "left":100, top:50 },
            {"id":"two", "title":"Group 2", "left":750, top:250, type:"constrained"  },
            {"id":"three", "title":"Nested Group", "left":50, "top":50, "group":"two"  }
        ],
        "nodes": [
           { "id": "window1", "name": "1", "left": 10, "top": 20, group:"one" },
            { "id": "window2", "name": "2", "left": 140, "top": 50, group:"one" },
            { "id": "window3", "name": "3", "left": 450, "top": 50 },
            { "id": "window4", "name": "4", "left": 110, "top": 370 },
            { "id": "window5", "name": "5", "left": 140, "top": 150, group:"one" },
            { "id": "window6", "name": "6", "left": 450, "top": 50, group:"two" },
            { "id": "window7", "name": "7", "left": 50, "top": 450 }
        ],
        "edges": [
            { source:"window3", target:"one"},
            { source:"window3", target:"window4"},
            { source:"one", target:"two"},
            { source:"window5", target:"window6"},
            { source:"window1", target:"window2"},
            { source:"window1", target:"window5"}
        ]
    };

    const view = {
        nodes: {
            [DEFAULT]: {
                templateId: "tmplNode",
                events: {
                    [EVENT_TAP]: (params) => {
                        toolkit.toggleSelection(params.node);
                    }
                }
            }
        },
        groups:{
            [DEFAULT]:{
                templateId:"tmplGroup",
                endpoint:BlankEndpoint.type,
                anchor:AnchorLocations.Continuous,
                revert:false,
                orphan:true,
                constrain:false,
                autoSize:true,
                layout:{
                    type:AbsoluteLayout.type
                },
                events:{
                    [EVENT_CLICK]:function(){
                        console.log(arguments)
                    }
                }
            },
            constrained:{
                parent:DEFAULT,
                constrain:true
            }
        },
        edges:{
            [DEFAULT]:{
                events:{
                    [EVENT_CLICK]:function() {
                        console.log(arguments)
                    },
                    "mouseover":function() { console.log("mouseover"); }
                }
            }
        }
    };

    // Get an instance of the BrowserUIVanilla Toolkit. provide a groupFactory; when you drag a Group on to the Surface we
    // set an appropriate title for the new Group. Provide a nodeFactory.
    const toolkit = newInstance({
        groupFactory:(type, data, callback) => {
            data.title = "Group " + (toolkit.getGroupCount() + 1)
            callback(data)
            return true
        },
        nodeFactory:(type, data, callback) => {
            data.name = (toolkit.getNodeCount() + 1)
            callback(data)
            return true
        }
    })

    // get the various dom elements
    const mainElement = document.querySelector(".jtk-demo-main"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview");

    //
    // Render the toolkit to `canvasElement`. For 2.x users upgrading to 5.x, not that `container` is now passed as a separate
    // argument, outside of the rest of the render options, whereas in 2.x it used to be one of the render options.
    //
    const renderer = toolkit.render(canvasElement, {
        view: view,
        layout: {
            type: ForceDirectedLayout.type,
            options: {
                absoluteBacked: true
            }
        },
        // FOR people coming from 2.x versions of the Toolkit, this key used to be `jsPlumb`.
        defaults: {
            anchor:AnchorLocations.Continuous,
            endpoint: BlankEndpoint.type,
            connector: { type:StateMachineConnector.type, options:{ cssClass: "connectorClass", hoverClass: "connectorHoverClass" } },
            paintStyle: { strokeWidth: 1, stroke: '#89bcde' },
            hoverPaintStyle: { stroke: "orange" },
            connectionOverlays: [
                { type:ArrowOverlay.type, options:{ fill: "#09098e", width: 10, length: 10, location: 1 } }
            ]
        },
        plugins:[
            {
                type:MiniviewPlugin.type,
                options:{
                    container:miniviewElement
                }
            },
            LassoPlugin.type
        ],
        dragOptions: {
            filter: ".delete *, .group-connect *, .delete"
        },
        magnetize:{
            afterDrag:true,
            afterGroupExpand:true
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
            },
            [EVENT_SURFACE_MODE_CHANGED]: (mode) => {
                renderer.removeClass(document.querySelector("[mode]"), "selected-mode");
                renderer.addClass(document.querySelector("[mode='" + mode + "']"), "selected-mode");
            },
            [EVENT_GROUP_ADDED]:(group) => {
                console.log("New group " + group.id + " added")
            }
        },
        consumeRightClick:false,
        zoomToFit:true,
        modelEvents:[
            {
                event:EVENT_TAP,
                selector:".delete",
                callback:(event, eventTarget, info) => {
                    toolkit.removeNode(info.obj)
                }
            },
            {
                event:EVENT_TAP,
                selector:".group-title .expand",
                callback:(event, eventTarget, info) => {
                    if (info.obj) {
                        renderer.toggleGroup(info.obj)
                    }
                }
            },
            {
                event:EVENT_TAP,
                selector:".group-delete",
                callback:(event, eventTarget, info) => {
                    toolkit.removeGroup(info.obj, true)
                }
            }
        ]
    });

    // load the data.
    toolkit.load({type: "json", data: data});

    // pan mode/select mode
    const controls = document.querySelector(".controls")
    renderer.on(controls, EVENT_TAP, "[mode]", function () {
        renderer.setMode(this.getAttribute("mode"));
    });

    //
    // on home button tap, zoom content to fit. Note here we use `on` to bind an event, as we're just binding to a DOM
    // element that is not part of our dataset. Compare this with `bindModelEvent` below.
    //
    renderer.on(controls, EVENT_TAP, "[reset]", function () {
        toolkit.clearSelection();
        renderer.zoomToFit();
    })

    toolkit.bind(EVENT_UNDOREDO_UPDATE, (state) => {
        controls.setAttribute("can-undo", state.undoCount > 0 ? "true" : "false")
        controls.setAttribute("can-redo", state.redoCount > 0 ? "true" : "false")
    })

    renderer.on(controls, EVENT_TAP, "[undo]",  () => {
        toolkit.undo()
    })

    renderer.on(controls, EVENT_TAP, "[redo]", () => {
        toolkit.redo()
    })

    //
    // Here, we are registering elements that we will want to drop onto the workspace and have
    // the toolkit recognise them as new nodes
    //
    createSurfaceDropManager({
        surface:renderer,
        source:document.querySelector(".node-palette"),
        selector:"[data-node-type]",
        dataGenerator:(e) => {
            return {
                type:"default"
            };
        }
    })
})

