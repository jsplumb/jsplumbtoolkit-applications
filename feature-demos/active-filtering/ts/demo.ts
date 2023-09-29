
import {
    SurfaceViewOptions,
    EVENT_CLICK,
    SurfaceMode,
    EVENT_CANVAS_CLICK,
    EVENT_SURFACE_MODE_CHANGED,
    DEFAULT, AnchorLocations,
    DotEndpoint,
    ready,
    newInstance,
    BrowserUI,
    Surface,
    isPort,
    Vertex,
    uuid,
    ObjectData,
    ForceDirectedLayout,
    MiniviewPlugin,
    ActiveFilteringPlugin,
    LassoPlugin, StateMachineConnector
} from "@jsplumbtoolkit/browser-ui"

const CLASS_SELECTED_MODE = "selected-mode"
const SELECTOR_SELECTED_MODE = "." + CLASS_SELECTED_MODE
const CLASS_HIGHLIGHT = "hl"

ready(() =>{

    const toolkit:BrowserUI = newInstance({
        portDataProperty:"items",
        beforeConnect:(source:Vertex, target:Vertex) => {
            // ignore node->node connections; our UI is not configured to produce them. we could catch it and
            // return false, though, which would ensure that nodes could not be connected programmatically.
            if (isPort(source) && isPort(target)) {

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

    const words = [ "CAT", "DOG", "COW", "HORSE", "DUCK", "HEN" ]

    const randomPort = (index:number) => {
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
        return { entries:out, index:index, id:uuid() }
    };

    const newNode = () => {
        const groupCount = Math.floor(Math.random() * 3) + 1,
            data:any = {
                id:uuid(),
                items:[]
            }

        for (let i = 0; i < groupCount; i++) {
            data.items.push(randomPort(i))
        }

        return toolkit.addNode(data)
    }

// ---------------------------- / end random node generator ---------------------------------------------

    // initial dataset consists of 5 random nodes.
    const nodeCount = 5;
    for (let i = 0; i < nodeCount;i++) {
        newNode()
    }

    const view:SurfaceViewOptions = {
        nodes: {
            [DEFAULT]: {
                templateId: "tmplNode"
            }
        },
        edges: {
            [DEFAULT]: {
                connector: { type:StateMachineConnector.type, options:{ curviness: 10 } },
                endpoint: { type:DotEndpoint.type, options:{ radius: 10 } },
                anchor: { type:AnchorLocations.Continuous, options:{ faces:["left", "right"]} }
            }
        }
    };

    const renderer:Surface = toolkit.render(canvasElement, {
        zoomToFit: true,
        view: view,
        layout: {
            type: ForceDirectedLayout.type
        },
        plugins:[
            {
                type:MiniviewPlugin.type,
                options:{
                    container:miniviewElement
                }
            },
            ActiveFilteringPlugin.type,
            {
                type:LassoPlugin.type,
                options:{lassoFilter: ".controls, .controls *, .miniview, .miniview *"}
            }
        ],
        events: {
            [EVENT_CANVAS_CLICK]: (e:Event) => {
                toolkit.clearSelection()
            },
            [EVENT_SURFACE_MODE_CHANGED]: (mode:string) => {
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
            id:(data:ObjectData) => data.id.substring(0, 5),
            entryNames:(data:ObjectData) => data.entries.join(' ')
        }
    })

    // pan mode/select mode
    renderer.on(mainElement, EVENT_CLICK, "[mode]",  (e:Event, el:HTMLElement) => {
        renderer.setMode(el.getAttribute("mode") as SurfaceMode)
    })

    // on home button tap, zoom content to fit.
    renderer.on(mainElement, EVENT_CLICK, "[reset]",  () => {
        toolkit.clearSelection()
        renderer.zoomToFit()
    })

    //
    // assign a class to a new node which brings the user's attention to it. then a little while later,
    // take it off.
    //
    function flash(el:Element) {
        renderer.addClass(el, CLASS_HIGHLIGHT)
        setTimeout(function() {
            renderer.removeClass(el, CLASS_HIGHLIGHT)
        }, 1950)
    }

    // on add node button, add a new node, zoom the display, flash the new element.
    renderer.on(mainElement, EVENT_CLICK, "[add]", () => {
        const node = newNode()
        renderer.zoomToFit()
        flash(renderer.getRenderedElement(node))
    });
})
