jsPlumbToolkit.ready(function() {


    var CLASS_SELECTED_MODE = "selected-mode"
    var SELECTOR_SELECTED_MODE = "." + CLASS_SELECTED_MODE
    var CLASS_HIGHLIGHT = "hl"

    var toolkit = jsPlumbToolkit.newInstance({
        portDataProperty:"items",
        beforeConnect:function(source, target) {
            // ignore node->node connections; our UI is not configured to produce them. we could catch it and
            // return false, though, which would ensure that nodes could not be connected programmatically.
            if (jsPlumbToolkit.isPort(source) && jsPlumbToolkit.isPort(target)) {

                // cannot create loopback connections
                if (source === target) {
                    return false
                }

                // cannot connect to Ports on the same Node as the Edge source
                if (source.getParent() === target.getParent()) {
                    return false
                }

                const sourceData = source.data.entries,
                    targetData = target.data.entries

                // attempt to match animals
                for (let i = 0; i < sourceData.length; i++) {
                    if (targetData.indexOf(sourceData[i]) !== -1) {
                        return true
                    }
                }
                return false
            }
        }
    });

    const mainElement = document.querySelector("#jtk-demo-connectivity"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview")

// ----------------------- this code is the random node generator. it's just for this demo --------------------------------------

    var words = [ "CAT", "DOG", "COW", "HORSE", "DUCK", "HEN" ]

    var randomPort = function(index) {
        const out = [], map = {}
        function _one() {
            let a, done = false
            while (!done) {
                a = words[Math.floor(Math.random() * words.length)]
                done = map[a] !== true
                map[a] = true
            }
            return a
        }
        out.push(_one())
        out.push(_one())
        return { entries:out, index:index, id:jsPlumbToolkit.uuid() }
    };

    var newNode = function() {
        const groupCount = Math.floor(Math.random() * 3) + 1,
            data = {
                id:jsPlumbToolkit.uuid(),
                items:[]
            }

        for (var i = 0; i < groupCount; i++) {
            data.items.push(randomPort(i))
        }

        return toolkit.addNode(data)
    };

// ---------------------------- / end random node generator ---------------------------------------------

    // initial dataset consists of 5 random nodes.
    var nodeCount = 5;
    for (let i = 0; i < nodeCount;i++) {
        newNode()
    }

    var view = {
        nodes: {
            "default": {
                templateId: "tmplNode"
            }
        },
        edges: {
            "default": {
                connector: { type:jsPlumbToolkit.StateMachineConnector.type, options:{ curviness: 10 } },
                endpoint: { type:jsPlumbToolkit.DotEndpoint.type, options:{ radius: 10 } },
                anchor: { type:jsPlumbToolkit.AnchorLocations.Continuous, options:{ faces:["left", "right"]} }
            }
        }
    };

    var renderer = toolkit.render(canvasElement, {
        zoomToFit: true,
        view: view,
        layout: {
            type: jsPlumbToolkit.ForceDirectedLayout.type
        },
        plugins:[
            {
                type:jsPlumbToolkit.MiniviewPlugin.type,
                options:{
                    container:miniviewElement
                }
            },
            jsPlumbToolkit.ActiveFilteringPlugin.type,
            {
                type:jsPlumbToolkit.LassoPlugin.type,
                options:{lassoFilter: ".controls, .controls *, .miniview, .miniview *"}
            }
        ],
        events: {
            "canvasClick": function(e) {
                toolkit.clearSelection()
            },
            "modeChanged": function(mode) {
                renderer.removeClass(document.querySelector(SELECTOR_SELECTED_MODE), CLASS_SELECTED_MODE)
                renderer.addClass(document.querySelector("[mode='" + mode + "']"), CLASS_SELECTED_MODE)
            }
        },
        consumeRightClick:false,
        // disable dragging from anywhere in the individual animal elements (drag can only be done via the header)
        dragOptions:{
            filter:"[data-jtk-port], [data-jtk-port] *"
        },
        templateMacros:{
            id:function(data) { return data.id.substring(0, 5) },
            entryNames:function(data) { return data.entries.join(' ') }
        }
    })

    // pan mode/select mode
    renderer.on(mainElement, jsPlumbToolkit.EVENT_CLICK, "[mode]",  function(e, el) {
        renderer.setMode(el.getAttribute("mode"))
    })

    // on home button tap, zoom content to fit.
    renderer.on(mainElement, jsPlumbToolkit.EVENT_CLICK, "[reset]",  function() {
        toolkit.clearSelection()
        renderer.zoomToFit()
    })

    //
    // assign a class to a new node which brings the user's attention to it. then a little while later,
    // take it off.
    //
    function flash(el) {
        renderer.addClass(el, CLASS_HIGHLIGHT)
        setTimeout(function() {
            renderer.removeClass(el, CLASS_HIGHLIGHT)
        }, 1950)
    }

    // on add node button, add a new node, zoom the display, flash the new element.
    renderer.on(mainElement, jsPlumbToolkit.EVENT_CLICK, "[add]", () => {
        const node = newNode()
        renderer.zoomToFit()
        flash(renderer.getRenderedElement(node))
    });

})
