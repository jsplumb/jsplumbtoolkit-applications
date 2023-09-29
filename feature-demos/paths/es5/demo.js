

jsPlumbToolkit.ready(function() {

    var data = jsPlumbToolkitDemoSupport.randomGraph(5, 10)

    // get a jsPlumbToolkit instance.
    var toolkit = jsPlumbToolkit.newInstance()

    var mainElement = document.querySelector("#jtk-demo-paths"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview"),
        controls = document.querySelector(".controls");

    // path traversal.
    var source = null

    var transport = null
    var animator

    // define the view. we use the template inferencing mechanism to
    // determine that all nodes will be drawn using the template `jtk-template-default`,
    // but we supply some information about edges. Note the overlays: on the default edge,
    // which means on every Edge, we have an arrow at location 1. On 'bidirectional' edges
    // we have an arrow at location 0 also. Two of our edges - [1-4] and [6-2] are marked
    // as being `directed:false` (for the graph to use) and `type:"bidirectional"` (for the
    // renderer to use).
    var view = {
        edges: {
            "default": {
                overlays: [
                    {type:"Arrow", options:{ fill: "#89bcde", width: 10, length: 10, location:1 } }
                ]
            },
            "bidirectional":{
                overlays: [
                    {type:"Arrow", options:{ fill: "#89bcde", width: 10, length: 10, location:0, direction:-1 } }
                ]
            }
        },
        nodes:{
            "default":{
                events: {
                    "tap":function(params) {
                        // on node click...
                        if (source == null) {
                            //... either set the current path source. here we also add a class
                            // so you can see its selected.
                            source = params
                            renderer.addClass(source.el, "jtk-animate-source")
                        }
                        else {

                            if (transport != null) {
                                transport.cancel()
                            }

                            // ...or trace a path from the current source to the clicked node.
                            transport = animator.tracePath({
                                source:source.obj,
                                target:params.obj,
                                overlay:{
                                    type:"Diamond",
                                    options:{
                                        width:15,
                                        length:15,
                                        fill: "#89bcde"
                                    }
                                },
                                options: {
                                    speed: 120
                                },
                                listener: stateChange
                            })
                            // cleanup the source for the next one.
                            renderer.removeClass(source.el, "jtk-animate-source")
                            source = null

                            if (transport == null) {
                                alert("No path found!")
                            }
                        }
                    }
                }
            }
        }
    }

    // load the data,
    toolkit.load({type: "json", data: data})

    // and then render it to "demo" with a "Spring" (force directed) layout.
    // supply it with some defaults for jsPlumb
    var renderer = toolkit.render(canvasElement, {
        view:view,
        layout: {
            type: "ForceDirected"
        },
        plugins:[
            {
                type:"miniview",
                options:{
                    container:miniviewElement
                }
            },
            {
                type:"lasso",
                options:{
                    filter: ".controls, .controls *, .miniview, .miniview *"
                }
            }
        ],
        dragOptions: {
            filter: ".delete *, .add *"
        },
        events: {
            "canvasClick":  function(e) {
                toolkit.clearSelection()
            },
            "modeChanged": function(mode) {
                renderer.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
                renderer.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
            }
        },
        defaults: {
            anchor:"Continuous",
            connector: { type:"Straight", options:{ cssClass: "connectorClass", hoverClass: "connectorHoverClass" } },
            endpoint: "Blank"
        },
        consumeRightClick:false
    })

    // get an animator instance to use
    animator = new jsPlumbToolkit.SurfaceAnimator(renderer)

    // pan mode/select mode
    renderer.on(controls, "tap", "[mode]", function(e) {
        renderer.setMode((e.target).getAttribute("mode"))
    })

    // on home button click, zoom content to fit.
    renderer.on(controls, "tap", "[reset]", function(e) {
        toolkit.clearSelection()
        renderer.zoomToFit()
    })

    // transport controls

    function stateChange(state) {
        controls.setAttribute("state", state)
        if (state === "stopped") {
            transport = null
        }
    }

    renderer.on(controls.querySelectorAll(".transport"), 'tap', function(e) {
        const action = (e.target).getAttribute("action")
        if (transport != null) {
            transport[action]()
        }
    })

})

