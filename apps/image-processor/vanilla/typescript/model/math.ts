import { Node, ObjectData } from "@jsplumbtoolkit/browser-ui"

function doMath(data:ObjectData, fn:(a:any, b:any) => any) {
    if (data["in:a"] == null || data["in:b"] == null) {
        data["out:result"] = null
        return false
    } else {
        try {
            data["out:result"] = fn(parseFloat(data["in:a"]), parseFloat(data["in:b"]))
            return true
        } catch (e) {
            data["out:result"] = null
            return false
        }
    }
}

export default {
    set: "math",
    name: "Math",
    types: [
        {
            id:"add",
            name:"Add",
            inputs:[
                { id:"a", label:"A", type:"number"},
                { id:"b", label:"B", type:"number"},
            ],
            outputs:[
                { id:"result", label:"Result", type:"number"}
            ],
            compute: async function(node:Node) {
                const data = node.data
                return doMath(data, (a,b) => a + b)
            }
        },
        {
            id:"subtract",
            name:"Subtract",
            inputs:[
                { id:"a", label:"A", type:"number"},
                { id:"b", label:"B", type:"number"},
            ],
            outputs:[
                { id:"result", label:"Result", type:"number"}
            ],
            compute: async function(node:Node) {
                const data = node.data
                return doMath(data, (a,b) => a - b)
            }
        },
        {
            id:"multiply",
            name:"Multiply",
            inputs:[
                { id:"a", label:"A", type:"number"},
                { id:"b", label:"B", type:"number"},
            ],
            outputs:[
                { id:"result", label:"Result", type:"number"}
            ],
            compute: async function(node:Node) {
                const data = node.data
                return doMath(data, (a,b) => a * b)
            }
        },
        {
            id:"divide",
            name:"Divide",
            inputs:[
                { id:"a", label:"A", type:"number"},
                { id:"b", label:"B", type:"number"},
            ],
            outputs:[
                { id:"result", label:"Result", type:"number"}
            ],
            compute: async function(node:Node) {
                const data = node.data
                return doMath(data, (a,b) => a / b)
            }
        }
    ]
}
