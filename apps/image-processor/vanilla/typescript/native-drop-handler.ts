import {consume, Surface, Edge,Node,Group,Port, Vertex, SurfaceObjectInfo, EventManager} from "@jsplumbtoolkit/browser-ui"
import {readImageFromFile} from "@jsplumb/canvas-image-processing"

export interface NativeDropHandlerOptions<T=Edge|Node|Group|Port|Vertex, E extends Element=Element> {
    selector?:string
    element?:Element
    surface:Surface
    hoverClass?:string,
    onDrop:(e:DragEvent, el:E, info?:SurfaceObjectInfo<T>) => any
}

const CLASS_HOVER_DEFAULT = "jtk-native-drop-hover"
const EVENT_DRAG_ENTER = "dragenter"
const EVENT_DRAG_LEAVE = "dragleave"
const EVENT_DRAG_OVER = "dragover"
const EVENT_DROP = "drop"

export class NativeDropHandler<T=Edge|Node|Group|Port|Vertex, E extends Element=Element> {

    hoverClasses:Array<string>
    private surface:Surface
    eventManager:EventManager

    constructor(options:NativeDropHandlerOptions<T, E>) {

        this.eventManager = new EventManager()
        this.surface = options.surface
        this.hoverClasses = [CLASS_HOVER_DEFAULT]

        if (options.hoverClass){
            this.hoverClasses.push(options.hoverClass)
        }

        const element = options.element || this.surface.getContainer().parentElement

        const _addClass = (e:DragEvent) => {
            consume(e)
            ;(e.target as HTMLElement).classList.add(...this.hoverClasses)
        }

        const enterOptions = [element, EVENT_DRAG_ENTER]
        if (options.selector) {
            enterOptions.push(options.selector)
        }
        enterOptions.push(_addClass)
        this.eventManager.on.apply(this.eventManager, enterOptions)

        const _removeClass = (e:DragEvent) => {
            consume(e)
            ;(e.target as HTMLElement).classList.remove(...this.hoverClasses)
        }

        const leaveOptions = [element, EVENT_DRAG_LEAVE]
        if (options.selector) {
            leaveOptions.push(options.selector)
        }
        leaveOptions.push(_removeClass)
        this.eventManager.on.apply(this.eventManager, leaveOptions)

        const _setDropEffect = (e:DragEvent) => {
            consume(e)
            e.dataTransfer.dropEffect = 'copy';
        }

        const copyOptions = [element, EVENT_DRAG_OVER]
        if (options.selector) {
            copyOptions.push(options.selector)
        }
        copyOptions.push(_setDropEffect)
        this.eventManager.on.apply(this.eventManager, copyOptions)

        const dropOptions = [ element, EVENT_DROP]
        if (options.selector) {
            dropOptions.push(options.selector)
        }
        dropOptions.push((e:DragEvent) => {
            if (!e.cancelBubble && !e.defaultPrevented) {
                consume(e)
                ;(e.target as HTMLElement).classList.remove(...this.hoverClasses)

                options.onDrop(e,
                    e.target as E,
                    this.surface.getObjectInfo(e.target) as unknown as SurfaceObjectInfo<T>)
            }
        })

        this.eventManager.on.apply(this.eventManager, dropOptions)
    }

}

export interface NativeImageDropHandlerOptions<T=Edge|Node|Group|Port|Vertex, E extends Element = Element> {
    imageDropped:(e:DragEvent, img:HTMLImageElement, targetElement:E, info?:SurfaceObjectInfo<T>) => any
    selector?:string
    surface:Surface
    hoverClass?:string
    element?:Element
}

export class NativeImageDropHandler<T=Edge|Node|Group|Port|Vertex, E extends Element = Element>{

    handler:NativeDropHandler<T, E>
    eventManager:EventManager

    constructor(options:NativeImageDropHandlerOptions<T, E>) {
        this.handler = new NativeDropHandler({
            surface:options.surface,
            element:options.element,
            selector:options.selector,
            hoverClass:options.hoverClass,
            onDrop:(e:DragEvent, el:E, info:SurfaceObjectInfo<T>) => {

                const dt = e.dataTransfer
                const files = dt.files
                const url= e.dataTransfer.getData('text/plain');

                if (url) {
                    const img = new Image()
                    img.onload= function () {
                        options.imageDropped(e, img, el, info)
                    }
                    img.src=url
                } else {
                    if (files[0].type.match(/image.*/)) {
                        readImageFromFile(files[0]).then((img:HTMLImageElement) => {
                            options.imageDropped(e, img, el, info)
                        })
                    }
                }
            }
        })
    }
}
