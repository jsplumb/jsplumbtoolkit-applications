<template>
    <div ref="container">

        <h1 v-if="currentType===''"></h1>

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
                <!--jtk-line-style current="{{lineStyle}}" jtk-att="lineStyle"></jtk-line-style-->
            </div>

            <div class="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="color"/>
            </div>
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
                    _renderEmptyContainer:() => this.currentType = '',
                    _refresh:(obj, cb) => {
                        this.currentType = obj.objectType
                        nextTick(cb)
                    }
                })
            })
        }
    }
</script>
