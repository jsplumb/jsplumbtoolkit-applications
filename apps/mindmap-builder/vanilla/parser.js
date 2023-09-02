
import {isNode, registerExporter, registerParser} from "@jsplumbtoolkit/browser-ui"
import {LEFT, MAIN, RIGHT, SUBTOPIC} from "./definitions"

export const MINDMAP_JSON = "mindmap-json"

const mindmapJsonParser = (jd, toolkit, parameters) => {

    const json = typeof jd === "string" ? JSON.parse(jd) : jd
    const data = json.data
    data.type = MAIN
    let mainTopic = toolkit.addNode(data)

    const _processChildren = (focus, direction) => {
        const c = focus.data.children || []
        c.forEach((_c) => {
            _c.direction = direction
            _c.type = SUBTOPIC
            // _c.parent = focus.id
            _c.children = _c.children || []
            const __c = toolkit.addNode(_c)
            toolkit.addEdge({source:focus, target:__c})
            _processChildren(__c, direction)
        })
    }

    const _processRootChildren = (direction) => {
        const n = data[direction]
        n.forEach(l => {
            l.type = SUBTOPIC
            l.direction = direction
            // l.parent = mainTopic.id
            l.children = l.children || []
            const ln = toolkit.addNode(l)
            toolkit.addEdge({source:mainTopic, target:ln, data:{direction:direction}})
            _processChildren(ln, direction)
        })
    }

    _processRootChildren(LEFT)
    _processRootChildren(RIGHT)

}

registerParser(MINDMAP_JSON, mindmapJsonParser)

// const mindmapJsonExporter = (toolkit, parameters) => {
//
//     const mainTopic = toolkit.filter(o => isNode(o) && o.data.type === MAIN).getNodeAt(0)
//
//     const _one = (v, direction) => {
//         const edges = direction === LEFT ? getLeftEdges(v, toolkit) : getRightEdges(v, toolkit)
//         const d = {
//             id:v.data.id,
//             label:v.data.label,
//             notes:v.data.notes || "",
//             children:edges.map(e => _one(e.target, direction))
//         }
//
//         return d
//     }
//
//     const mainLeft = getLeftEdges(mainTopic, toolkit)
//     const mainRight = getRightEdges(mainTopic, toolkit)
//     const left = mainLeft.map(ml => _one(ml.target, LEFT))
//     const right = mainRight.map(ml => _one(ml.target, RIGHT))
//
//     return {
//         name:"mindmap",
//         data:{
//             id:mainTopic.data.id,
//             label:mainTopic.data.label,
//             notes:mainTopic.data.notes || "",
//             left,
//             right
//         }
//     }
// }
//
// registerExporter(MINDMAP_JSON, mindmapJsonExporter)
