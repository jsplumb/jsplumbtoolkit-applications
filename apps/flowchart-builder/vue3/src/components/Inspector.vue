<template>
    <div ref="container">

        <h1 v-if="currentType===''"></h1>

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
            <!--jtk-line-style current="{{lineStyle}}" jtk-att="lineStyle"></jtk-line-style-->
            <div>Color</div>
            <input type="color" jtk-att="color"/>
        </div>


    </div>
</template>
<script>

    import {loadSurface} from "@jsplumbtoolkit/browser-ui-vue3";
    import { Inspector } from "@jsplumbtoolkit/browser-ui"

    import { nextTick } from "vue"

    export default {
        data:() => {
            return { currentType:'' }
        },
        props:{
            surfaceId:String
        },
        mounted() {
            const self = this
            loadSurface(this.surfaceId, (surface) => {

                // create an inspector and give it the container element
                // and the surface.

                new Inspector({
                    container:this.$refs.container,
                    surface,
                    renderEmptyContainer:() => this.currentType = '',
                    refresh:(obj, cb) => {
                        this.currentType = obj.objectType
                        nextTick(cb)
                    }
                })
            })
        }
    }
</script>
