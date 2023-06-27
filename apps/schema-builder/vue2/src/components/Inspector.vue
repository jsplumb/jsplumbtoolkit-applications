<template>
    <div ref="container">

        <div v-if="currentType === ''"></div>

        <div v-if="currentType === TABLE" class="jtk-inspector jtk-node-inspector">
            <div>Name</div>
            <input type="text" jtk-att="name" jtk-focus="true"/>
        </div>

        <div v-if="currentType === VIEW" class="jtk-inspector jtk-node-inspector">
            <div>Name</div>
            <input type="text" jtk-att="name" jtk-focus="true"/>
            <div>Query</div>
            <textarea jtk-att="query" rows="10"/>
        </div>

        <div v-if="currentType === COLUMN" class="jtk-inspector jtk-node-inspector">
            <div>Name</div>
            <input type="text" jtk-att="name" jtk-focus="true"/>
            <div>Datatype</div>
            <label v-for="d in datatypes" :key="d.id">
                <input type="radio" jtk-att="datatype" name="datatype" :value="d.id"/>{{d.description}}
            </label>
        </div>

        <div v-if="currentType === RELATIONSHIP" class="jtk-inspector jtk-edge-inspector">
            <div>Cardinality</div>
            <label v-for="c in cardinalities" :key="c.id">
                <input type="radio" :name="PROPERTY_CARDINALITY" :jtk-att="PROPERTY_CARDINALITY" :value="c.id"/>{{c.name}}
            </label>
        </div>


    </div>
</template>
<script>

    import Vue from "vue"
    import {getSurface} from "@jsplumbtoolkit/browser-ui-vue2";
    import { Inspector, isNode, isPort } from "@jsplumbtoolkit/browser-ui"

    import { cardinalities, datatypes } from '../definitions'
    import { COLUMN, TABLE, VIEW, RELATIONSHIP, PROPERTY_CARDINALITY } from "../constants";

    export default {
        data:() => {
            return {
                currentType:'',
                inspector:null,
                TABLE,
                VIEW,
                COLUMN,
                RELATIONSHIP,
                PROPERTY_CARDINALITY,
                cardinalities,
                datatypes
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
                        this.currentType = isNode(obj) ? obj.data.type : isPort(obj) ? COLUMN : RELATIONSHIP
                        Vue.nextTick(cb)
                    }
                })

            })
        }
    }
</script>
