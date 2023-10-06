import {
    VanillaInspector, isNode, isEdge
} from "@jsplumbtoolkit/browser-ui"

import { ACTION_INPUT, ACTION_MESSAGE, ACTION_CHOICE, START, END, ACTION_TEST } from "./demo";

const PROPERTY_MESSAGE = "message"
const PROPERTY_PROMPT = "prompt"
const PROPERTY_LABEL = "label"
const CHOICE_PORT = "choice-port"
const EDGE = "edge"

/**
 * Inspector for chatbot nodes.
 */
export class ChatbotInspector extends VanillaInspector {

    inspectors = {
        [START]:`<div/>`,
        [END]:`<div/>`,
        [ACTION_MESSAGE]:`<div class="jtk-chatbot-inspector">
                            <span>Message:</span>
                            <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
                            </div>`,
        [ACTION_INPUT]:`<div class="jtk-chatbot-inspector">
<span>Message:</span>
                            <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
                            <span>Prompt:</span>
                            <input type="text" jtk-att="${PROPERTY_PROMPT}" placeholder="prompt"/>
                            </div>`,
        [ACTION_CHOICE]:`<div class="jtk-chatbot-inspector">
                        <span>Message:</span>
                            <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
                            </div>`,
        [ACTION_TEST]:`<div class="jtk-chatbot-inspector">
                        <span>Message:</span>
                            <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
                            </div>`,
        [CHOICE_PORT]:`<div class="jtk-chatbot-inspector">
                    <span>Label:</span>
                    <input type="text" jtk-att="${PROPERTY_LABEL}" jtk-focus placeholder="enter label..."/>
                    </div>`,
        [EDGE]:`<div class="jtk-chatbot-inspector">
                <div>Label</div>
                <input type="text" jtk-att="${PROPERTY_LABEL}"/>
</div>`
    }

    constructor(options) {
        super(Object.assign(options, {
            templateResolver:(obj) => {
                if (isNode(obj)) {
                    return this.inspectors[obj.type]
                } else if (isEdge(obj)) {
                    return this.inspectors[EDGE]
                }
                else {
                    return this.inspectors[CHOICE_PORT]
                }
            }
        }))

    }
}
