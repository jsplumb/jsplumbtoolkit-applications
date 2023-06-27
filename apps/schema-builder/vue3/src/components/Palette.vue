<template>
    <div class="jtk-schema-palette">
        <div class="jtk-schema-palette-item" :data-type="entry.type" title="Drag to add new" v-for="entry in data" :key="entry.type">
            {{entry.label}}
        </div>
    </div>
</template>

<script>

    import {defineComponent} from "vue"
    import { SurfaceDrop } from '@jsplumbtoolkit/browser-ui-vue3'

    import { TABLE, VIEW } from "../constants"

    export default defineComponent({
        mixins:[ SurfaceDrop ],
        data:function() {
            return {
                data:[
                    { label:"Table", type:TABLE },
                    { label:"View", type:VIEW}
                ]
            };
        }
    })

</script>

