<template>
    <div class="jtk-schema-table jtk-schema-element">
        <div class="jtk-schema-element-name">
            <div class="jtk-schema-delete jtk-schema-delete-vertex" title="Click to delete" v-on:click="deleteTable()"></div>
            <span>{{obj.name}}</span>
            <div class="jtk-schema-buttons">
                <div class="jtk-schema-edit-name jtk-schema-edit" title="Click to edit table name" v-on:click="editTable()"></div>
                <div class="jtk-schema-new-column jtk-schema-add" title="Click to add a new column" v-on:click="addColumn()"></div>
            </div>
        </div>
        <div class="jtk-schema-table-columns">
            <ColumnComponent v-for="c in obj.columns" :key="c.id" v-bind:obj="c" v-bind:vertex="getNode()"></ColumnComponent>
        </div>
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
        components:{ColumnComponent},
        methods:{
          deleteTable:function(){
              this.getToolkit().removeNode(this.getNode())
          },
          editTable:function() {
              this.getToolkit().setSelection(this.getNode())
          },
          addColumn:function() {
              this.getToolkit().addNewPort(this.getNode(), COLUMN, {
                  id: uuid(),
                  name: "new column",
                  primaryKey: false,
                  datatype: datatypes[0].id
              });
          }
        }
    }
</script>
