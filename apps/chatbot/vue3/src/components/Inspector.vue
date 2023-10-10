<template>
    <div ref="container">

        <div v-if="currentType === ''"></div>
        <div v-if="currentType === START"></div>
        <div v-if="currentType === END"></div>

        <div v-if="currentType === ACTION_MESSAGE" class="jtk-chatbot-inspector">
            <span>Message:</span>
            <input type="text" jtk-att="message" placeholder="message"/>
        </div>

        <div v-if="currentType === ACTION_INPUT" class="jtk-chatbot-inspector">
                <span>Message:</span>
                <input type="text" jtk-att="message" placeholder="message"/>
                <span>Prompt:</span>
                <input type="text" jtk-att="prompt" placeholder="prompt"/>
        </div>

        <div v-if="currentType === ACTION_CHOICE" class="jtk-chatbot-inspector">
            <span>Message:</span>
            <input type="text" jtk-att="message" placeholder="message"/>
        </div>

        <div v-if="currentType === ACTION_TEST" class="jtk-chatbot-inspector">
            <span>Message:</span>
            <input type="text" jtk-att="message" placeholder="message"/>
        </div>

        <div v-if="currentType === CHOICE_PORT" class="jtk-chatbot-inspector">
            <span>Label:</span>
            <input type="text" jtk-att="label" jtk-focus placeholder="enter label..."/>
        </div>

        <div v-if="currentType === EDGE" class="jtk-chatbot-inspector">
            <div>Label</div>
            <input type="text" jtk-att="label"/>
        </div>


    </div>
</template>
<script>

    import { nextTick } from "vue"
    import {loadSurface} from "@jsplumbtoolkit/browser-ui-vue3";
    import { Inspector, isNode, isPort } from "@jsplumbtoolkit/browser-ui"

    import { START, END, ACTION_TEST, ACTION_CHOICE, ACTION_INPUT, ACTION_MESSAGE } from "../constants";

    const CHOICE_PORT="choicePort"
    const EDGE = "edge"

    export default {
        data:() => {
            return {
                currentType:'',
                inspector:null,
                START, END, ACTION_MESSAGE, ACTION_INPUT, ACTION_CHOICE, ACTION_TEST, CHOICE_PORT, EDGE
            }
        },
        props:{
            surfaceId:String
        },
        mounted() {
            loadSurface(this.surfaceId, (surface) => {

                // create an inspector. give it the container element
                // and the surface and functions to use to render an
                // empty container (no selection) and to render an editor.
                // here we toggle `currentType` and let the template draw what
                // it needs to.
                this.inspector = new Inspector({
                    container:this.$refs.container,
                    surface,
                    renderEmptyContainer:() => {
                        this.currentType = ''
                    },
                    refresh:(obj, cb) => {
                        this.currentType = isNode(obj) ? obj.data.type : isPort(obj) ? CHOICE_PORT : EDGE
                        nextTick(cb)
                    }
                })

            })
        }
    }
</script>
