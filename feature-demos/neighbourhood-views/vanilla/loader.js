import {uuid} from "@jsplumbtoolkit/browser-ui";

/**
 * A custom loader for the initial dataset. It's very straightforward to write a custom data loader
 * with the Toolkit.
 * @param data
 * @param toolkit
 * @param parameters
 */
export function parser(data, toolkit, parameters) {
    function _one(d, id) {
        const type = d.formula == null ? "base" : "formula"
        const pl = {
            id:uuid(),
            label:d.label,
            type
        }

        if (d.formula) {
            pl.formula = d.formula
        }

        const n = toolkit.addNode(pl)
        if (d.children) {
            for(let c in d.children) {
                const cNode = _one(d.children[c], c)
                toolkit.addEdge({source:n, target:cNode})
            }
        }
        return n
    }

    for (let root in data) {
        _one(data[root], root)
    }
}


