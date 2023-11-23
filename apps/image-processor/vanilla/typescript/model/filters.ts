import { Node } from "@jsplumbtoolkit/browser-ui"
import {
    filterBlur,
    filterBrightness,
    filterContrast,
    filterGrayScale, filterHueRotate,
    filterInvert,
    filterOpacity,
    filterSaturate,
    filterSepia,
    filterTint
} from "@jsplumb/canvas-image-processing"

const filters = {
    set:"filter",
    name:"Filter",
    types:[
        {
            id:"greyscale",
            name:"Greyscale",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:100 }
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
                    data["out:image"] = await filterGrayScale(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"blur",
            name:"Blur",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"radius", label:"Radius", type:"number", defaultValue:10 }
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
                    const c = data["in:radius"] || data["radius"]
                    data["out:image"] = await filterBlur(data["in:image"], c)
                    return true
                }
            }
        },
        {
            id:"invert",
            name:"Invert",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:100 }
            ],
            outputs:[ { id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterInvert(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"sepia",
            name:"Sepia",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:100 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterSepia(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"saturate",
            name:"Saturate",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:100 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterSaturate(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"opacity",
            name:"Opacity",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:50 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterOpacity(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"contrast",
            name:"Contrast",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:200 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterContrast(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"brightness",
            name:"Brightness",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:200 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterBrightness(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"hue-rotate",
            name:"Hue rotate",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"amount", label:"Amount", type:"number", defaultValue:90 }
            ],
            outputs:[{ id:"image", label:"Image", type:"image" }],
            compute: async function(node:Node) {
                const data = node.data
                if (data["in:image"] == null) {
                    data["out:image"] = null
                    return false
                } else {
                    data["out:image"] = await filterHueRotate(data["in:image"], data["in:amount"] || data["amount"])
                    return true
                }
            }
        },
        {
            id:"tint",
            name:"Tint",
            inputs:[
                { id:"image", label:"Image", type:"image" },
                { id:"color", label:"Color", type:"color", defaultValue:"#F47710" }
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
                    const c = data["in:color"] || data["color"]
                    data["out:image"] = await filterTint(data["in:image"], c)
                    return true
                }
            }
        }
    ]
}

export const FILTER_INSPECTORS:Record<string, any> = { }

filters.types.forEach(type => {
    const dataField = type.inputs[1], inputType = dataField.type === "color" ? "color" : "text"
    FILTER_INSPECTORS[type.id] = {
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label" jtk-focus/></label>
            <label>${dataField.label}:<input type="${inputType}" jtk-att="${dataField.id}" placeholder="enter ${dataField.id}"/></label>`
    }
})

export default filters;

