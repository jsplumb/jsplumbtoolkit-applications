<template>
    <div class="jtk-schema-view jtk-schema-element">
        <div class="jtk-schema-element-name">
            <div class="jtk-schema-view-delete jtk-schema-delete jtk-schema-delete-vertex" title="Delete view" v-on:click="deleteView()"></div>
            <span>{{obj.name}}</span>
            <div class="jtk-schema-buttons">
                <div class="jtk-schema-edit-name jtk-schema-edit" title="Edit view" v-on:click="editView()"></div>
            </div>
        </div>
        <div class="jtk-schema-view-details">{{obj.query}}</div>
    </div>
</template>
<script>

    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue2'
    import ColumnComponent from './ColumnComponent.vue'

    import { COLUMN } from '../constants'
    import { datatypes } from "../definitions";
    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export default {
        mixins:[BaseNodeComponent],
        methods:{
            deleteView:function(){
                this.getToolkit().removeNode(this.getNode())
            },
            editView:function() {
                this.getToolkit().setSelection(this.getNode())
            }
        }
    }
</script>
