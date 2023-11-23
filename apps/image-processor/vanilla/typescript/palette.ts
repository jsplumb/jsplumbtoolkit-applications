import {SurfaceDropManager, uuid, Surface, Vertex, BrowserUiRecado} from "@jsplumbtoolkit/browser-ui"
import {ImageProcessorModel} from "./definitions"

import filters from './model/filters'
import transforms from './model/transforms'
import math from './model/math'
import {INPUT_TYPES} from './model/inputs'
import basic from './model/basic'

const paletteSectionTemplate = `<div class="palette-section">
                <div class="palette-header" data-$set-bg>{{name}}</div>
                <div class="palette-section-entries">
                    <r-each in="types" key="id">
                        <div data-type="$set.{{id}}">{{name}}</div>
                    </r-each>
                </div>
            </div>`

function drawPalette(container:HTMLElement) {
    const renderer = new BrowserUiRecado({
        templateResolver:(setId:string) => {
            return paletteSectionTemplate.replace(/\$set/g, setId)
        }
    })

    const b = renderer.template("basic", basic) as any
    container.appendChild(b)

    const f = renderer.template("filter", filters) as any
    container.appendChild(f)

    const t = renderer.template("transform", transforms) as any
    container.appendChild(t)

    const ip = renderer.template("input", INPUT_TYPES) as any
    container.appendChild(ip)

    const m = renderer.template("math", math) as any
    container.appendChild(m)

}

/**
 * Manages drag/drop of new nodes. This class draws out the palette from the lists of filters, transforms, inputs and math ops, using
 * a `BrowserUiRecado` instance, which is the Toolkit's default template renderer.
 */
export class Palette {

    constructor(surface:Surface, model:ImageProcessorModel) {

        const container = document.getElementById("palette")
        drawPalette(container)

        new SurfaceDropManager({
            surface,
            source:container,
            selector:"[data-type]",
            dataGenerator:(el) => {
                // when the user begins a drag, generate an appropriate dataset from the model.
                const type = el.getAttribute("data-type")
                const modelObject = model.nodeTypes[type]
                const out:Record<string, any> = {
                    type,
                    id:uuid(),
                    label:modelObject.name
                }

                modelObject.inputs.forEach(input => {
                    if (input.defaultValue != null) {
                        out[input.id] = input.defaultValue
                    }
                })

                return out
            },
            // when a new node has been dragged on, select it.
            onVertexAdded:(v:Vertex) => surface.toolkitInstance.setSelection(v)

        })
    }

}
