
import { VanillaInspector, Surface, isNode, Base, Node } from "@jsplumbtoolkit/browser-ui"
import {ImageProcessorModel} from "./definitions"

import { INPUT_INSPECTORS } from "./model/inputs"
import { FILTER_INSPECTORS } from './model/filters'
import { TRANSFORM_INSPECTORS } from './model/transforms'
import { BASIC_INSPECTORS } from './model/basic'

const handlers:Record<string, Record<string, {template:(n:Node) => string}>> = {
    input:INPUT_INSPECTORS,
    filter:FILTER_INSPECTORS,
    transform:TRANSFORM_INSPECTORS,
    basic:BASIC_INSPECTORS
}

export class ImageInspector extends VanillaInspector {

    model:ImageProcessorModel

    constructor(container:HTMLElement, surface:Surface, model:ImageProcessorModel) {
        super({
            container,
            surface,
            templateResolver:(obj:Base) => {
                if (isNode(obj)) {
                    return this._renderNodeTemplate(obj)
                }

                return ''
            },
            cacheTemplates:false,
            renderEmptyContainer:() => `<h1>SELECT SOMETHING INNIT</h1>`,
            refresh:(obj:Base, cb:()=> any)=>null
        })

        this.model = model
    }

    _renderNodeTemplate(obj:Node):string {
        const [set, type] = obj.type.split(".")
        try {
            return handlers[set][type].template(obj)
        } catch (e) {
            return `<div/>`
        }

    }
}
