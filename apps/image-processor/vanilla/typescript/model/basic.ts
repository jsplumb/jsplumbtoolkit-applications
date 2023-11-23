import { Node } from "@jsplumbtoolkit/browser-ui"
import {imageURLToImage} from "@jsplumb/canvas-image-processing"

export default {
    set:"basic",
    name:"Basic",
    types:[
        {
            id:"source",
            name:"Source",
            inputs:[
                { id:"url", label:"Url", type:"string" }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                let inputUrl = data["in:url"]
                if (inputUrl == null) {
                    let image = data["image"]
                    if (image == null) {
                        data["out:image"] = null
                        data.width = null
                        data.height = null
                        return false
                    } else {
                        data["out:image"] = image
                        data.width = image.naturalWidth
                        data.height = image.naturalHeight
                        return true
                    }
                } else {
                    const img = await imageURLToImage(inputUrl)
                    data["out:image"] = img
                    data.width = img.naturalWidth
                    data.height = img.naturalHeight
                    return true
                }
            }
        },
        {
            id:"display",
            name:"Display",
            inputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            outputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                data["out:image"] = data["in:image"]
                return data["in:image"] != null
            }
        },
        {
            id:"properties",
            name:"Properties",
            inputs:[
                { id:"image", label:"Image", type:"image" }
            ],
            outputs:[
                { id:"width", label:"Width", type:"number" },
                { id:"height", label:"Height", type:"number" }
            ],
            compute: async function(node:Node) {
                const data = node.data
                if(data["in:image"] == null) {
                    return false
                } else {
                    data["out:width"] = data["in:image"].naturalWidth
                    data["out:height"] = data["in:image"].naturalHeight

                    return true
                }
            }
        }
    ]
}

export const BASIC_INSPECTORS:Record<string, any> = {
    "source": {
        template: (n: Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>`
    },
    "display": {
        template: (n: Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>`
    },
    "properties": {
        template: (n: Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>`
    }
}
