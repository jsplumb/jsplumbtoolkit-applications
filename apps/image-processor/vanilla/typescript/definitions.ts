import {Node, Port} from "@jsplumbtoolkit/browser-ui"

export const TYPE_DISPLAY = "display"
export const TYPE_SOURCE = "source"

export const ATTRIBUTE_WIDTH = "width"
export const ATTRIBUTE_HEIGHT = "height"
export const ATTRIBUTE_LABEL = "label"

export const CANVAS_SIZE = {w:200, h:200}

export interface ImageProcessorInput {
    id:string, label:string, type:string, defaultValue?:any
}

export interface ImageProcessorOutput {
    id:string, label:string, type:string, defaultValue?:any
}

export interface ImageProcessorModel {
    nodeTypes:Record<string, {
        name:string,
        inputs:Array<ImageProcessorInput>,
        outputs:Array<ImageProcessorOutput>
    }>
}

export interface ImageProcessorNode extends Node {
    dirty?:boolean
}

export interface ImageProcessorPort extends Port {
    getParent:() => ImageProcessorNode
}

export interface OperationSet {
    set:string
    name:string
    types:Array<ImageOperation>
}

export type ComputeFunction = (node:Node) => any

export interface ImageOperation {
    id:string
    name:string
    compute: ComputeFunction
    inputs:Array<ImageProcessorInput>
    outputs:Array<ImageProcessorOutput>
}
