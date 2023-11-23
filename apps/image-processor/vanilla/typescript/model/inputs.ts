import {Node} from "@jsplumbtoolkit/browser-ui"
import {OperationSet} from "../definitions"

async function verifyValue(node:Node) {
    if (node.data.value == null) {
        node.data["out:value"] = null
        return false
    } else {
        node.data["out:value"] = node.data.value
        return true
    }
}

export const INPUT_TYPES:OperationSet = {
    set:"input",
    name:"Input",
    types:[
        {
            id:"text",
            name:"Text",
            inputs:[],
            outputs:[
                { id:"value", label:"Text", type:"string" }
            ],
            compute: verifyValue
        },
        {
            id:"boolean",
            name:"Boolean",
            inputs:[],
            outputs:[
                { id:"value", label:"Boolean", type:"boolean" }
            ],
            compute: verifyValue
        },
        {
            id:"color",
            name:"Color",
            inputs:[],
            outputs:[
                { id:"value", label:"Color", type:"color" }
            ],
            compute: verifyValue
        },
        {
            id:"number",
            name:"Number",
            inputs:[],
            outputs:[
                { id:"value", label:"Number", type:"number" }
            ],
            compute: verifyValue
        }
    ]
}

export const INPUT_INSPECTORS:Record<string, any> = {
    "text":{
        template:(n:Node) => `
            <label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>
            <label>Text:<input type="text" jtk-att="value" placeholder="enter text value" jtk-focus/></label>
`
    },
    "boolean":{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>
            <label>Value:<input type="checkbox" jtk-att="value" /></label>`
    },
    "color":{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>
            <label>Color:<input type="color" jtk-att="value" /></label>`
    },
    "number":{
        template:(n:Node) => `<label>Label:<input type="text" jtk-att="label"  placeholder="enter label"/></label>
            <label>Number:<input type="text" jtk-att="value"  jtk-focus/></label>`
    }
}
