<template>
    <div ref="container">

        <div v-if="currentType === ''"></div>

        <div v-if="currentType === 'Node'" class="jtk-inspector jtk-node-inspector">
            <div class="jtk-inspector-section">
                <div>Text</div>
                <input type="text" jtk-att="text" jtk-focus/>
            </div>
            <div class="jtk-inspector-section">
                <div>Fill</div>
                <input type="color" jtk-att="fill"/>
            </div>

            <div class="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="textColor"/>
            </div>

            <div class="jtk-inspector-section">
                <div>Outline</div>
                <input type="color" jtk-att="outline"/>
            </div>
        </div>

        <div v-if="currentType === 'Edge'" class="jtk-inspector jtk-edge-inspector">
            <div class="jtk-inspector-section">
                <div>Label</div>
                <input type="text" jtk-att="label"/>
            </div>
            <div class="jtk-inspector-section">
                <div>Line style</div>

            </div>

            <div class="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="color"/>
            </div>
        </div>


    </div>
</template>
<script>

    import Vue from "vue"
    import {getSurface} from "@jsplumbtoolkit/browser-ui-vue2";
    import { Inspector } from "@jsplumbtoolkit/browser-ui"

    export default {
        data:() => {
            return { currentType:'add' }
        },
        props:{
            surfaceId:String
        },
        mounted() {
            getSurface(this.surfaceId, (surface) => {

                // create an inspector. give it the container element
                // and the surface and functions to use to render an
                // empty container (no selection) and to render an editor.
                // here we toggle `currentType` and let the template draw what
                // it needs to.
                new Inspector({
                    container:this.$refs.container,
                    surface,
                    _renderEmptyContainer:() => {
                        this.currentType = ''
                    },
                    _refresh:(obj, cb) => {
                        this.currentType = obj.objectType
                        Vue.nextTick(cb)
                    }
                })

            })
        }
    }
</script>
