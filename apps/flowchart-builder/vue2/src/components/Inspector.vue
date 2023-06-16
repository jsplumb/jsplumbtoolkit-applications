<template>
    <div ref="container">

        <div v-if="currentType === ''"></div>

        <div v-if="currentType === 'Node'" class="jtk-inspector jtk-node-inspector">
            <div>Text</div>
            <input type="text" jtk-att="text" jtk-focus/>
            <div>Fill</div>
            <input type="color" jtk-att="fill"/>
            <div>Color</div>
            <input type="color" jtk-att="textColor"/>
            <div>Outline</div>
            <input type="color" jtk-att="outline"/>
        </div>

        <div v-if="currentType === 'Edge'" class="jtk-inspector jtk-edge-inspector">
            <div>Label</div>
            <input type="text" jtk-att="label"/>
            <div>Line style</div>
            <jsplumb-edge-type-picker v-bind:edgeMappings="edgeMappings" v-bind:inspector="inspector" property-name="lineStyle"/>
            <div>Color</div>
            <input type="color" jtk-att="color"/>
        </div>


    </div>
</template>
<script>

    import Vue from "vue"
    import {getSurface} from "@jsplumbtoolkit/browser-ui-vue2";
    import { Inspector } from "@jsplumbtoolkit/browser-ui"

    export default {
        data:() => {
            return {
                currentType:'',
                inspector:null
            }
        },
        props:{
            surfaceId:String,
            edgeMappings:Array
        },
        mounted() {
            getSurface(this.surfaceId, (surface) => {

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
                        this.currentType = obj.objectType
                        Vue.nextTick(cb)
                    }
                })

            })
        }
    }
</script>
