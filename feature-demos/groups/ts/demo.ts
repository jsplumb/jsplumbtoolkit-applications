
import {
    SurfaceViewOptions,
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
    Node,
    ObjectInfo,
    EVENT_GROUP_ADDED,
    AbsoluteLayout,
    EVENT_UNDOREDO_UPDATE,
    UndoRedoUpdateParams,
    createSurfaceDropManager,
    ForceDirectedLayout,
    MiniviewPlugin,
    StateMachineConnector,
    LassoPlugin, BrowserElement
} from "@jsplumbtoolkit/browser-ui"

ready(() => {


// jsPlumbToolkit code.

    const view:SurfaceViewOptions = {
        nodes: {
            [DEFAULT]: {
                templateId: "tmplNode",
                events: {
                    [EVENT_TAP]: (params:{node:Node}) => {
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
                padding:10
            },
            constrained:{
                parent:DEFAULT,
                constrain:true
            },
            elastic:{
                templateId:"tmplElasticGroup",
                elastic:true,
                minSize:{ w:250, h:250 },
                padding:10
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
        groupFactory:(type:string, data:Record<string, any>, callback:Function) => {
            data.title = "Group " + (toolkit.getGroupCount() + 1)
            callback(data)
            return true
        },
        nodeFactory:(type:string, data:Record<string, any>, callback:Function) => {
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
            [EVENT_CANVAS_CLICK]: (e:MouseEvent) => {
                toolkit.clearSelection()
            },
            [EVENT_SURFACE_MODE_CHANGED]: (mode:string) => {
                renderer.removeClass(document.querySelector("[mode]") as BrowserElement, "selected-mode");
                renderer.addClass(document.querySelector("[mode='" + mode + "']") as BrowserElement, "selected-mode");
            },
            [EVENT_GROUP_ADDED]:(group:Group) => {
                console.log("New group " + group.id + " added")
            }
        },
        consumeRightClick:false,
        zoomToFit:true
    });

    // pan mode/select mode
    const controls = document.querySelector(".controls") as BrowserElement
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

    toolkit.bind(EVENT_UNDOREDO_UPDATE, (state:UndoRedoUpdateParams) => {
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
    // Attach event handlers to 'delete' buttons. Note here the method `bindModelEvent`, which binds an event handler to some
    // named event on each of the vertices in the dataset. The callback is given the original event, the specific DOM element on
    // which the event occurred, and details about the model object on which the event occurred.
    //
    renderer.bindModelEvent(EVENT_TAP, ".delete", (event: Event, eventTarget: HTMLElement, info: ObjectInfo<Node>) =>{
        toolkit.removeNode(info.obj)
    })

    //
    // listen for group expand/collapse
    //
    renderer.bindModelEvent(EVENT_TAP, ".expand", (event: Event, eventTarget: HTMLElement, info: ObjectInfo<Group>) => {
        if (info.obj) {
            renderer.toggleGroup(info.obj)
        }
    })

    //
    // listen for clicks on group delete buttons
    //
    renderer.bindModelEvent(EVENT_TAP, ".group-delete", (event: Event, eventTarget: HTMLElement, info: ObjectInfo<Group>) => {
        toolkit.removeGroup(info.obj, true)
    })

    //
    // Here, we are registering elements that we will want to drop onto the workspace and have
    // the toolkit recognise them as new nodes
    //
    createSurfaceDropManager({
        surface:renderer,
        source:document.querySelector(".node-palette"),
        selector:"[data-type]",
        dataGenerator:(e:Element) => {
            return {
                type:e.getAttribute("data-type")
            };
        }
    })

    // load the data.
    toolkit.load({url:"./dataset.json"});
})

