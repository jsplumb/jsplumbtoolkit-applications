
jsPlumbToolkit.ready(function() {

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
                padding:10
            },
            constrained:{
                parent:"default",
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
                selector:".expand",
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
        selector:"[data-type]",
        dataGenerator:function(e) {
            return {
                type:e.getAttribute("data-type")
            };
        }
    })

    toolkit.load({
        url:'./dataset.json'
    })
})

