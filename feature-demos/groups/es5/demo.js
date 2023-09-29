
jsPlumbToolkit.ready(function() {

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

    /**
     * issues with groups:
     *
     * - surely 'revert' is the opposite of orphan, right?  what is the point of setting one of these to false and the other to true?
     * - setting `constrain:true` would mean none of the other flags - revert, orphan, autoSize, had any point, right?
     * - when you drag a child out of the bounds of group 1, it just resizes the group, instead of orphaning the child. NB this only applies if you drag it
     *   in a positive direction in either axis. if you drag it out of the top/left of the element it does get orphaned, but the group still resizes as if the node
     *   is still a child. ALSO in this case, the miniview DOES repaint itself wtaf.
     * - autosize doesnt work when it should shrink
     * - the miniview doesnt respond to size change events that resulted from an auto size
     * - there should be a type of 'constrain' where the user can still drag an element out of the bounds of the group, but the element is not
     *   orphaned, the group is resized instead. that is kind of how group one is erroneously working now. I think it's a combination of autoSize:true and
     *   not having set `orphan:true`
     */

    var view = {
        nodes: {
            "default": {
                templateId: "tmplNode",
                events: {
                    "tap": function(params) {
                        toolkit.toggleSelection(params.node);
                    }
                }
            }
        },
        groups:{
            "default":{
                templateId:"tmplGroup",
                endpoint:jsPlumbToolkit.BlankEndpoint.type,
                anchor:jsPlumbToolkit.AnchorLocations.Continuous,
                revert:false,
                orphan:true,
                constrain:false,
                autoSize:true,
                layout:{
                    type:jsPlumbToolkit.AbsoluteLayout.type
                },
                events:{
                    "click":function(){
                        console.log(arguments)
                    }
                }
            },
            constrained:{
                parent:"default",
                constrain:true
            }
        },
        edges:{
            "default":{
                events:{
                    "click":function() {
                        console.log(arguments)
                    },
                    "mouseover":function() { console.log("mouseover"); }
                }
            }
        }
    };

    // Get an instance of the BrowserUIVanilla Toolkit. provide a groupFactory; when you drag a Group on to the Surface we
    // set an appropriate title for the new Group. Provide a nodeFactory.
    var toolkit = jsPlumbToolkit.newInstance({
        groupFactory:function(type, data, callback) {
            data.title = "Group " + (toolkit.getGroupCount() + 1)
            callback(data)
            return true
        },
        nodeFactory:function(type, data, callback) {
            data.name = (toolkit.getNodeCount() + 1)
            callback(data)
            return true
        }
    })

    // get the various dom elements
    var mainElement = document.querySelector(".jtk-demo-main"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview");

    //
    // Render the toolkit to `canvasElement`. For 2.x users upgrading to 5.x, not that `container` is now passed as a separate
    // argument, outside of the rest of the render options, whereas in 2.x it used to be one of the render options.
    //
    var renderer = toolkit.render(canvasElement, {
        view: view,
        layout: {
            type: jsPlumbToolkit.ForceDirectedLayout.type,
            options: {
                absoluteBacked: true
            }
        },
        // FOR people coming from 2.x versions of the Toolkit, this key used to be `jsPlumb`.
        defaults: {
            anchor:jsPlumbToolkit.AnchorLocations.Continuous,
            endpoint: jsPlumbToolkit.BlankEndpoint.type,
            connector: { type:jsPlumbToolkit.StateMachineConnector.type, options:{ cssClass: "connectorClass", hoverClass: "connectorHoverClass" } },
            paintStyle: { strokeWidth: 1, stroke: '#89bcde' },
            hoverPaintStyle: { stroke: "orange" },
            connectionOverlays: [
                { type:jsPlumbToolkit.ArrowOverlay.type, options:{ fill: "#09098e", width: 10, length: 10, location: 1 } }
            ]
        },
        plugins:[
            {
                type:jsPlumbToolkit.MiniviewPlugin.type,
                options:{
                    container:miniviewElement
                }
            },
            jsPlumbToolkit.LassoPlugin.type
        ],
        dragOptions: {
            filter: ".delete *, .group-connect *, .delete"
        },
        magnetize:{
            afterDrag:true,
            afterGroupExpand:true
        },
        events: {
            "canvasClick": (e) => {
                toolkit.clearSelection()
            },
            "modeChanged": (mode) => {
                renderer.removeClass(document.querySelector("[mode]"), "selected-mode");
                renderer.addClass(document.querySelector("[mode='" + mode + "']"), "selected-mode");
            },
            "group:added":(group) => {
                console.log("New group " + group.id + " added")
            }
        },
        consumeRightClick:false,
        zoomToFit:true,
        modelEvents:[
            {
                event:jsPlumbToolkit.EVENT_TAP,
                selector:".delete",
                callback:function(event, eventTarget, info) {
                    toolkit.removeNode(info.obj)
                }
            },
            {
                event:jsPlumbToolkit.EVENT_TAP,
                selector:".group-title .expand",
                callback:function(event, eventTarget, info) {
                    if (info.obj) {
                        renderer.toggleGroup(info.obj)
                    }
                }
            },
            {
                event:jsPlumbToolkit.EVENT_TAP,
                selector:".group-delete",
                callback:function(event, eventTarget, info) {
                    toolkit.removeGroup(info.obj, true)
                }
            }
        ]
    });

    // load the data.
    toolkit.load({type: "json", data: data});

    // pan mode/select mode
    var controls = document.querySelector(".controls")
    renderer.on(controls, jsPlumbToolkit.EVENT_TAP, "[mode]", function () {
        renderer.setMode(this.getAttribute("mode"));
    });

    //
    // on home button tap, zoom content to fit. Note here we use `on` to bind an event, as we're just binding to a DOM
    // element that is not part of our dataset. Compare this with `bindModelEvent` below.
    //
    renderer.on(controls, jsPlumbToolkit.EVENT_TAP, "[reset]", function () {
        toolkit.clearSelection();
        renderer.zoomToFit();
    })

    toolkit.bind(jsPlumbToolkit.EVENT_UNDOREDO_UPDATE, function(state) {
        controls.setAttribute("can-undo", state.undoCount > 0 ? "true" : "false")
        controls.setAttribute("can-redo", state.redoCount > 0 ? "true" : "false")
    })

    renderer.on(controls, jsPlumbToolkit.EVENT_TAP, "[undo]",  function() {
        toolkit.undo()
    })

    renderer.on(controls, jsPlumbToolkit.EVENT_TAP, "[redo]", function() {
        toolkit.redo()
    })

    //
    // Here, we are registering elements that we will want to drop onto the workspace and have
    // the toolkit recognise them as new nodes
    //
    jsPlumbToolkit.createSurfaceDropManager({
        surface:renderer,
        source:document.querySelector(".node-palette"),
        selector:"[data-node-type]",
        dataGenerator:function(e) {
            return {
                type:"default"
            };
        }
    })
})

