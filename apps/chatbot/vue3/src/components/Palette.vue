<template>
    <div class="jtk-schema-palette">
        <div class="jtk-chatbot-palette-item" :data-type="entry.type" title="Drag to add new" v-for="entry in nodeTypes" :key="entry.type">
            {{entry.label}}
        </div>

    </div>
</template>

<script>

    import { defineComponent } from "vue";
    import { SurfaceDrop } from '@jsplumbtoolkit/browser-ui-vue3'

    import { nodeTypes } from "../constants";

    export default defineComponent({
        mixins:[ SurfaceDrop ],
        data:function() {
            return {
                nodeTypes
            }
        }
    })

</script>

