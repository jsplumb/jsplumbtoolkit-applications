import {DEFAULT, EVENT_TAP, JsPlumbToolkit, Node, UINodeDefinition} from "@jsplumbtoolkit/browser-ui"

import filters from './model/filters'
import transforms from './model/transforms'
import math from './model/math'
import {INPUT_TYPES} from './model/inputs'
import basic from './model/basic'
import {ComputeFunction, ImageOperation, OperationSet, CANVAS_SIZE, TYPE_DISPLAY, TYPE_SOURCE} from "./definitions"


/**
    This file contains the code that generates the templates for each node type. Most of the nodes are of the same form in this
 app, with the exception of the source/display nodes, which have a canvas and some other controls.
 */

const header = `<div class="jtk-imp-$set-$type jtk-imp-$set">
            <div data-header data-$set-bg>{{label}}<div class="jtk-imp-delete-node"></div></div>
            <div class="jtk-imp-ports">`

function processSet(set:OperationSet, uiDefinitions:Record<string, UINodeDefinition>, processors:Record<string, ComputeFunction>, nodeTypes:Record<string, ImageOperation>, inject?:(set:OperationSet, type:ImageOperation) => string) {
    const setId = set.set
    set.types.forEach(type => {
        const key = `${set.set}.${type.id}`

        nodeTypes[key] = type

        const h = header.replace(/\$type/g, type.id).replace(/\$set/g, setId)
        let inputPorts = `<div class="jtk-imp-inputs">`
        type.inputs.forEach(tin => {
            inputPorts += `<div class="jtk-in">
                    <div class="jtk-imp-ep" data-jtk-target="true" data-jtk-port="in:${tin.id}" data-jtk-port-type="target" data-jtk-scope="${tin.type}"/>
                    <span>${tin.label}</span>
                    </div>`
        })
        inputPorts += "</div>"

        let outputPorts = `<div class="jtk-imp-outputs">`
        type.outputs.forEach(tin => {
            outputPorts += `<div class="jtk-out">
                    <div class="jtk-imp-ep" data-jtk-source="true" data-jtk-port="out:${tin.id}" data-jtk-port-type="source" data-jtk-scope="${tin.type}"/>
                    <span>${tin.label}</span>
                    </div>`
        })
        outputPorts += "</div>"

        const injection = inject ? inject(set, type) : ""

        uiDefinitions[key] = {
            template:h + inputPorts + outputPorts + '</div>' + injection + "</div>",
            parent:DEFAULT
        }

        processors[key] = type.compute || (() => { return {} })

    })
}

const downloadIcon = `<svg:svg width="24" height="24" viewBox="0 0 48 48">
    <svg:path d="M38 18h-8v-12h-12v12h-8l14 14 14-14zm-28 18v4h28v-4h-28z"/>
    <svg:path d="M0 0h48v48h-48z" fill="none"/>
</svg:svg>`
const uploadIcon = `<svg:svg viewBox="0 0 24 24" width="24" height="24">
    <svg:path d="M18.9,18.5H4.8c-0.6,0-1.1-0.5-1.1-1.1V8.5h5.6c3.1,0,6.3,0,9.4,0c0.1,0,0.5,0,0.9,0.4c0.2,0.2,0.4,0.5,0.4,0.9v7.6C20.1,18,19.6,18.5,18.9,18.5z" fill="none" stroke="black" stroke-miterlimit="10" stroke-width="1.5"/>
    <svg:path d="M12.9,8.5c-3.1,0-6.2,0.1-9.3,0.1v-3c0-0.6,0.5-1,1-1l4.4,0C10.3,5.9,11.6,7.2,12.9,8.5z" fill="none" stroke="black"  stroke-miterlimit="10" stroke-width="1.5"/>
</svg:svg>`

export function initialize(toolkit:JsPlumbToolkit) {

    const nodeTypes:Record<string, ImageOperation> = {}
    const processors:Record<string, ComputeFunction> = {}
    const uiDefinitions:Record<string, UINodeDefinition> = {
        [DEFAULT]:{
            events:{
                [EVENT_TAP]:(p:{obj:Node}) => toolkit.setSelection(p.obj)
            }
        }
    }

    processSet(transforms, uiDefinitions, processors, nodeTypes)
    processSet(filters, uiDefinitions, processors, nodeTypes)

    processSet(INPUT_TYPES, uiDefinitions, processors, nodeTypes)

    processSet(math, uiDefinitions, processors, nodeTypes)


    // Source and display nodes have a canvas and image dimensions, and the display node has a download button.
    processSet(basic, uiDefinitions, processors, nodeTypes, (set, type) => {
        if (type.id === TYPE_SOURCE || type.id === TYPE_DISPLAY) {
            const extraButtons = type.id === TYPE_DISPLAY ? `<a class="jtk-imp-download" title="Download image">${downloadIcon}</a>` : `<a class="jtk-imp-upload" title="Upload image">${uploadIcon}</a>`
            return `<canvas width="${CANVAS_SIZE.w}" height="${CANVAS_SIZE.h}"/><div data-width="{{width}}" data-height="{{height}}" class="jtk-imp-dim">{{width}}x{{height}}</div>${extraButtons}`
        } else {
            return ""
        }
    })

    return { uiDefinitions, processors, nodeTypes }
}
