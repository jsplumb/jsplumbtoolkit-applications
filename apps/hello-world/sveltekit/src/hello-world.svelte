<script>
    import {
        AbsoluteLayout,
        newInstance,
        AnchorLocations,
        ArrowOverlay,
            DEFAULT,
        BlankEndpoint,
        EVENT_TAP,
        EVENT_CANVAS_CLICK
    } from '@jsplumbtoolkit/browser-ui'

    import { SurfaceComponent } from "@jsplumbtoolkit/browser-ui-svelte"

    import HelloComponent from './components/hello-component.svelte'
    import WorldComponent from './components/world-component.svelte'

    import {onMount} from "svelte"

    let surfaceComponent

    const toolkit = newInstance()

    const renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        simpleEdgeStyles:true,
        // Use a Continuous anchor and a blank endpoint by default.
        defaults:{
            anchor:AnchorLocations.Continuous,
            endpoint:BlankEndpoint.type
        },
        events:{
            EVENT_CANVAS_CLICK:function() {
                toolkit.clearSelection()
            }
        }
    }

    const viewParams = {
        nodes:{
            // abstract parent node definition - declares a tap listener
            clickable:{
                events:{
                    tap:(p) => {
                        alert(`You clicked on node ${p.obj.id}`)
                        toolkit.setSelection(p.obj)
                    }
                }
            },
            // definition for 'hello' nodes. Extends 'clickable' to get the tap listener.
            hello:{
                parent:"clickable",
                component:HelloComponent
            },
            // definition for 'world' nodes. Extends 'clickable' to get the tap listener.
            world:{
                parent:"clickable",
                component:WorldComponent
            }
        },
        edges:{
            // a default edge definition. Declares an arrow overlay at its tip and extracts 'label' from
            // edge data and displays it as a label overlay (by default at location 0.5)
            [DEFAULT]:{
                overlays:[
                    {
                        type:ArrowOverlay.type,
                        options:{
                            location: 1
                        }
                    }
                ],
                label:"{{label}}"
            }
        }
    }

    onMount(async () => {


        toolkit.load({
            url:'./dataset.json'
        })


    })

</script>

<div id="container">
    <SurfaceComponent viewParams={viewParams} renderParams={renderParams} toolkit={toolkit} id="surface" bind:this={surfaceComponent}/>

</div>

