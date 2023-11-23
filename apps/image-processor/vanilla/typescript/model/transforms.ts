import { Node } from "@jsplumbtoolkit/browser-ui"
import {
    mirrorImage,
    blendImages,
    cropImage,
    overlayImage,
    imageThreshold,
    clipImage,
    resizeImage, AXIS_X
} from '@jsplumb/canvas-image-processing'
import {ATTRIBUTE_HEIGHT, ATTRIBUTE_LABEL, ATTRIBUTE_WIDTH} from "../definitions"

const COMPOSITE_OPERATIONS:Array<GlobalCompositeOperation> = ["color" ,
    "color-burn" ,"color-dodge" ,"darken" ,"destination-atop" ,
    "destination-in","destination-out" ,"destination-over" ,
    "difference" ,
    "exclusion" , "hard-light" , "hue" , "lighten" , "lighter" , "luminosity" ,
    "multiply" , "overlay" , "saturation" , "screen" , "soft-light" , "source-atop" ,
    "source-in" , "source-out" , "source-over" , "xor"];

export const TRANSFORM_MIRROR = "mirror"
export const TRANSFORM_BLEND = "blend"
export const TRANSFORM_CLIP = "clip"
export const TRANSFORM_CROP = "crop"
export const TRANSFORM_RESIZE = "resize"
export const TRANSFORM_OVERLAY = "overlay"
export const TRANSFORM_THRESHOLD = "threshold"

export default {
    set:"transform",
    name:"Transform",
    types:[

        {
            id:TRANSFORM_MIRROR,
            name:"Mirror",
            inputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await mirrorImage(data["in:image"], data["axis"] || AXIS_X)
                    return true
                }
            }
        },

        {
            id:TRANSFORM_BLEND,
            name:"Blend",
            inputs:[
                { id:"image1", label:"Image", type:"image" },
                { id:"image2", label:"Image", type:"image" }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image1"] == null || data["in:image2"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await blendImages(data["in:image1"], data["in:image2"], data["operation"])
                    return true
                }
            }
        },
        {
            id:TRANSFORM_CLIP,
            name:"Clip",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"mask", label:"Mask", type:"image" }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null || data["in:mask"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await clipImage(data["in:image"], data["in:mask"])
                    return true
                }
            }
        },
        {
            id:TRANSFORM_RESIZE,
            name:"Resize",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:ATTRIBUTE_WIDTH, label:"Width", type:"number", defaultValue:150 },
                { id:"height", label:"Height", type:"number", defaultValue:150 }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    const w = data["in:width"] || data.width
                    const h = data["in:height"] || data.height
                    // convert the image
                    data["out:image"] = await resizeImage(data["in:image"], w, h)
                    return true
                }
            }
        },
        {
            id:TRANSFORM_CROP,
            name:"Crop",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"width", label:"Width", type:"number", defaultValue:150 },
                { id:"height", label:"Height", type:"number", defaultValue:150 },
                { id:"x", label:"X", type:"number", defaultValue:0 },
                { id:"y", label:"Y", type:"number", defaultValue:0 }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    const w = data["in:width"] || data.width
                    const h = data["in:height"] || data.height
                    const x = data["in:x"] || data.x
                    const y = data["in:y"] || data.y
                    // convert the image
                    debugger
                    data["out:image"] = await cropImage(data["in:image"], x, y, w, h)
                    return true
                }
            }
        },
        {
            id:TRANSFORM_OVERLAY,
            name:"Overlay",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"overlay", label:"Overlay", type:"image" },
                { id:"x", label:"X", type:"number", defaultValue:0 },
                { id:"y", label:"Y", type:"number", defaultValue:0 }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null || data["in:overlay"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    const x = data["in:x"] || data.x
                    const y = data["in:y"] || data.y
                    data["out:image"] = await overlayImage(data["in:image"], data["in:overlay"], x, y)
                    return true
                }
            }
        },

        {
            id:TRANSFORM_THRESHOLD,
            name:"Threshold",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"threshold", label:"Threshold", type:"number", defaultValue:127 },
                { id:"value", label:"Value", type:"number", defaultValue:255 }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    const threshold = data["in:threshold"] || data.threshold
                    const value = data["in:value"] || data.value
                    // convert the image
                    data["out:image"] = await imageThreshold(data["in:image"], threshold, value)
                    return true
                }
            }
        }
    ]
}


export const TRANSFORM_INSPECTORS:Record<string, any> = {
    [TRANSFORM_MIRROR]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" jtk-focus placeholder="enter label"/></label>
            <label>Axis:<select jtk-att="axis"><option value="x">X</option><option value="y">Y</option><option value="x_y">X and Y</option></select></label>`
    },
    [TRANSFORM_BLEND]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" jtk-focus placeholder="enter label"/></label>
            <label>Mode:<select jtk-att="operation">${COMPOSITE_OPERATIONS.map(c => "<option value=\"" + c + "\">" + c + "</option>").join("")}</select></label>`
    },
    [TRANSFORM_CLIP]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" jtk-focus placeholder="enter label"/></label>`
    },
    [TRANSFORM_RESIZE]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" placeholder="enter label"/></label>
            <label>Width:<input type="text" jtk-att="${ATTRIBUTE_WIDTH}" jtk-focus/></label>
            <label>Height:<input type="text" jtk-att="${ATTRIBUTE_HEIGHT}"/></label>`
    },
    [TRANSFORM_CROP]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" placeholder="enter label"/></label>
            <label>X:<input type="text" jtk-att="x" jtk-focus/></label>
            <label>Y:<input type="text" jtk-att="y"/></label>
            <label>Width:<input type="text" jtk-att="${ATTRIBUTE_WIDTH}"/></label>
            <label>Height:<input type="text" jtk-att="${ATTRIBUTE_HEIGHT}"/></label>`
    },
    [TRANSFORM_OVERLAY]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" placeholder="enter label"/></label>
            <label>X:<input type="text" jtk-att="x" jtk-focus/></label>
            <label>Y:<input type="text" jtk-att="y"/></label>`
    },
    [TRANSFORM_THRESHOLD]:{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="${ATTRIBUTE_LABEL}" placeholder="enter label"/></label>
            <label>Threshold:<input type="text" jtk-att="threshold" jtk-focus/></label>
            <label>Value:<input type="text" jtk-att="value"/></label>`
    }
}
