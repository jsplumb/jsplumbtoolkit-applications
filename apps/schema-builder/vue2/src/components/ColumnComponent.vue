<template>
    <div class="jtk-schema-table-column" :data-type="obj.datatype" :data-primary-key="obj.primaryKey" :data-jtk-port="obj.id" :data-jtk-scope="obj.datatype" data-jtk-source="true" data-jtk-target="true">
        <div class="jtk-schema-table-column-delete jtk-schema-delete" v-on:click="deleteColumn()"></div>
        <div><span>{{obj.name}}</span></div>
        <div class="jtk-schema-table-column-edit jtk-schema-edit" v-on:click="editColumn"></div>
    </div>
</template>
<script>

    export default {
        props:{
            obj:Object,
            vertex:Object
        },
        methods:{
            deleteColumn:function() {
                this.$parent.getToolkit().removePort(this.vertex, this.obj.id)
            },
            editColumn:function() {
                const column = this.vertex.getPort(this.obj.id)
                this.$parent.getToolkit().setSelection(column)
            }
        }
    }
</script>
