<script>
    import {
        ForceDirectedLayout,
            AbsoluteLayout,
            StateMachineConnector,
        newInstance,
        AnchorLocations,
        ArrowOverlay,
        BlankEndpoint,
        SurfaceDropManager,
        MiniviewPlugin,
            LassoPlugin,
            DEFAULT, EVENT_TAP,
        EVENT_CLICK, EVENT_CANVAS_CLICK,
        EVENT_SURFACE_MODE_CHANGED,
        EVENT_GROUP_ADDED,
            ControlsComponent

    } from '@jsplumbtoolkit/browser-ui'

    import { SurfaceComponent } from "@jsplumbtoolkit/browser-ui-svelte"

    import NodeComponent from './NodeComponent.svelte'
    import GroupComponent from './GroupComponent.svelte'

    import {onMount} from "svelte"

    let surfaceComponent

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

    const viewParams = {
        nodes: {
            [DEFAULT]: {
                component:NodeComponent,
                events: {
                    [EVENT_TAP]: (params) => {
                        toolkit.toggleSelection(params.node);
                    }
                }
            }
        },
        groups:{
            [DEFAULT]:{
                component:GroupComponent,
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
                    }
                }
            }
        }
    };

    const renderParams = {
        layout: {
            type: ForceDirectedLayout.type,
            options: {
                absoluteBacked: true
            }
        },
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
        zoomToFit:true
    }

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

    onMount(async() => {

        const surface = surfaceComponent.getSurface()

        // add a miniview
        surface.addPlugin({
            type:MiniviewPlugin.type,
            options:{
                container:document.querySelector(".miniview")
            }
        })

        // add the controls component, a helper component we ship
        // for people to use as inspiration for their own
        new ControlsComponent(document.querySelector(".controls"), surface)

        // set up drag/drop of new nodes/groups
        new SurfaceDropManager({
            surface,
            source:document.querySelector(".node-palette"),
            selector:"[data-node-type]",
            dataGenerator:(e) => {
                return {
                    type:"default"
                };
            }
        })

        // load initial dataset
        toolkit.load({data:data})
    })




</script>

<div class="jtk-demo-main">

    <!-- this is the main drawing area -->
    <div class="jtk-demo-canvas">

        <SurfaceComponent viewParams={viewParams} renderParams={renderParams} toolkit={toolkit} id="surface" bind:this={surfaceComponent}/>

      <!-- controls -->
        <div class="controls"></div>
      <!-- miniview -->
        <div class="miniview"></div>
    </div>

    <div class="jtk-demo-rhs">

        <div class="sidebar node-palette">
            <div title="Drag Node to canvas" data-node-type="node" class="sidebar-item">
                <i class="icon-tablet"></i>Drag Node
            </div>
            <div title="Drag Group to canvas" data-jtk-is-group="true" data-node-type="group" class="sidebar-item">
                <i class="icon-tablet"></i>Drag Group
            </div>
        </div>
        <div class="description">
            <p>
                This is a demonstration of the Groups functionality using the Toolkit's Svelte integration.
            </p>
            <ul>
                <li>Drag new Nodes/Groups from the palette on the left onto the workspace. You can drag Nodes directly into Groups.</li>
                <li>Collapse/Expand Groups with the -/+ buttons</li>
                <li>Drag existing Nodes into Groups to add them.</li>
                <li>Nodes can be dragged out of Group 1 but not out of Group 2</li>
                <li>Click the 'Pencil' icon to enter 'select' mode, then select several nodes. Click the canvas to exit.</li>
                <li>Click the 'Home' icon to zoom out and see all the nodes.</li>
            </ul>
        </div>
    </div>



</div>
