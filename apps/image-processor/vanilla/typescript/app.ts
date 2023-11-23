import {
    ready,
    newInstance,
    AbsoluteLayout,
    BlankEndpoint, AnchorLocations,
    DEFAULT, EVENT_CANVAS_CLICK, EVENT_DBL_CLICK,
    StateMachineConnector,
    ActiveFilteringPlugin,
    PlainArrowOverlay,
    Port,
    EVENT_CLICK, Edge, SurfaceObjectInfo, LabelOverlay, MiniviewPlugin, Node,
    ControlsComponent, uuid
} from "@jsplumbtoolkit/browser-ui"

import { initialize } from './generate-templates'
import { Processor } from './process'
import {Palette } from './palette'

import {imageToDataURL, readImageFromFile, setCanvasImageFromImage} from '@jsplumb/canvas-image-processing'
import {CANVAS_SIZE, ImageProcessorInput, ImageProcessorNode, ImageProcessorOutput} from "./definitions"
import {ImageInspector} from "./inspector"
import {NativeImageDropHandler} from "./native-drop-handler"

ready(() => {

    let model:any

    // Get a new Toolkit instance
    const toolkit = newInstance({
        beforeConnect:(source:Port, target:Port) => {
            return target.objectType === Port.objectType && source.objectType === Port.objectType && source.getParent().id !== target.getParent().id
        },
        portExtractor:(data) => {
            const t = model.nodeTypes[data.type]
            if (t == null) {
                return []
            } else {
                const p:Array<{id:string, label:string, type:string, defaultValue?:any, input?:boolean, output?:boolean}> = t.inputs.map((i:ImageProcessorInput) => Object.assign({}, i, {id:`in:${i.id}`, input:true}))
                p.push(...t.outputs.map((i:ImageProcessorOutput) => Object.assign({}, i, {id:`out:${i.id}`, output:true})))
                return p
            }
        }
    })

    model = initialize(toolkit)

    // Get the DOM element to render into
    const container = document.getElementById("container")
    const miniview = document.getElementById("miniview")

    const processor = new Processor(toolkit, model, () => {
        toolkit.filter(o => o.type === "basic.display").eachNode((idx,dn) => {
            const el = surface.getRenderedElement(dn),
                canvas = el.querySelector("canvas"),
                a = el.querySelector(".jtk-imp-download") as HTMLAnchorElement

            const hasImage = setCanvasImageFromImage(canvas, CANVAS_SIZE.w, CANVAS_SIZE.h,  dn.data["in:image"])
            el.setAttribute("data-has-image", "" + hasImage)

            if (hasImage) {
                a.href = imageToDataURL(dn.data["in:image"])
                a.download = `${dn.data.label}.png`
            } else {
                const ctx = canvas.getContext("2d")
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        })
        toolkit.filter(o => o.type === "basic.source").eachNode((idx,dn) => {
            const canvas = surface.getRenderedElement(dn).querySelector("canvas")
            setCanvasImageFromImage(canvas, CANVAS_SIZE.w, CANVAS_SIZE.h, dn.data["out:image"])
        })
    }, () => {
        alert("ERROR " )
    })

    const view = {
        nodes:model.uiDefinitions,
        ports:{
            source:{
                isSource:true,
                maxConnections:-1,
                anchor:AnchorLocations.Right
            },
            target:{
                isTarget:true,
                maxConnections:1,
                anchor:AnchorLocations.Left
            }
        },
        edges:{
            [DEFAULT]:{
                overlays:[
                    {
                        type:LabelOverlay.type,
                        options:{
                            label:"x",
                            cssClass:"jtk-imp-overlay-delete",
                            events:{
                                [EVENT_CLICK]:(p:{edge:Edge}) => {
                                    toolkit.removeEdge(p.edge)
                                }
                            }
                        }
                    },
                    {
                        type:PlainArrowOverlay.type,
                        options:{
                            location:1,
                            width:7,
                            length:7
                        }
                    }
                ],
                events:{
                    [EVENT_DBL_CLICK]:(p:{edge:Edge}) => toolkit.removeEdge(p.edge)
                }
            }
        }
    }

    // Render to a Surface.
    const surface = toolkit.render(container, {
        layout:{
            type:AbsoluteLayout.type
        },
        plugins:[
            ActiveFilteringPlugin.type,
            {
                type:MiniviewPlugin.type,
                options:{
                    container:miniview,
                    typeFunction:(n:Node) => n.type.split(/\./)[0]
                }
            }
        ],
        defaults:{
            endpoint:{
                type:BlankEndpoint.type,
                options:{
                    cssClass:"jtk-imp-blank-ep"
                }
            },
            connector:StateMachineConnector.type
        },
        events:{
            [EVENT_CANVAS_CLICK]:() => {
                toolkit.clearSelection()
            }
        },
        view,
        magnetize:{
            afterDrag:true,
        },
        consumeRightClick:false,
        modelEvents:[
            {
                event: EVENT_CLICK,
                selector: ".jtk-imp-delete-node",
                callback: (e: MouseEvent, el: HTMLElement, info: SurfaceObjectInfo<ImageProcessorNode>) => {
                    toolkit.removeNode(info.obj)
                }
            },
            {
                event: EVENT_CLICK,
                selector: ".jtk-imp-upload",
                callback: (e: MouseEvent, el: HTMLElement, info: SurfaceObjectInfo<ImageProcessorNode>) => {
                    let input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = _ => {
                        let files =   Array.from(input.files);
                        if (files.length > 0 && files[0].type.match(/image.*/)) {
                            readImageFromFile(files[0]).then((img) => {
                                toolkit.update(info.obj, {
                                    image: img,
                                    width: img.naturalWidth,
                                    height: img.naturalHeight
                                })
                            })
                        }
                    };
                    input.click();

                }
            }
        ],
        zoomToFit:true
    })


    /**
     * Attach a native image drop handler to the surface, targetting ".jtk-imp-basic-source canvas" -
     * that is, the canvas element of source nodes. When an image is dropped we
     * update the node - the processor will respond to the event and recalculate.
     */
    new NativeImageDropHandler<ImageProcessorNode, HTMLCanvasElement>({
        selector:".jtk-imp-basic-source canvas",
        hoverClass:"jtk-imp-drop-target",
        surface,
        imageDropped:(e:DragEvent, img:HTMLImageElement, el:HTMLCanvasElement, info:SurfaceObjectInfo<ImageProcessorNode>) => {
            toolkit.update(info.obj, {
                image:img,
                width:img.naturalWidth,
                height:img.naturalHeight
            })
        }
    })

    /**
     * Attach a native image drop handler to the surface's whitespace.
     * When a drop occurs on here we add a new node with that image in its data.
     * The processor will pick up the node added event and handle the new node.
     */
    new NativeImageDropHandler<ImageProcessorNode, HTMLElement>({
        hoverClass:"jtk-imp-drop-target",
        surface,
        imageDropped:(e:DragEvent, img:HTMLImageElement, el:HTMLElement, info:SurfaceObjectInfo<ImageProcessorNode>) => {

            const evtLoc = surface.mapEventLocation(e)
            toolkit.addNode({
                type:"basic.source",
                label:"Source",
                id:uuid(),
                left:evtLoc.x,
                top:evtLoc.y,
                image:img,
                width:img.naturalWidth,
                height:img.naturalHeight
            })
        }
    })

    new ImageInspector(document.getElementById("inspector"), surface, model)
    new ControlsComponent(document.getElementById("controls"), surface)

    new Palette(surface, model)

    debugger

    toolkit.load({
        url:'./dataset.json',
        onload:() => {
            toolkit.filter(o => o.type === "basic.source").eachNode((idx,dn) => {
                if (dn.data.url != null) {

                    const img = new Image()
                    img.onload = function() {
                        toolkit.update(dn, {
                            image:img,
                            width:img.naturalWidth,
                            height:img.naturalHeight
                        })
                    }
                    img.src = dn.data.url
                }
            })
        }
    })
})
