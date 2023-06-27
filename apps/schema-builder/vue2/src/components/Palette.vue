<template>
    <div class="jtk-schema-palette">
        <div class="jtk-schema-palette-item" :data-type="entry.type" title="Drag to add new" v-for="entry in data" :key="entry.type">
            {{entry.label}}
        </div>
    </div>
</template>

<script>

    import { SurfaceDrop } from '@jsplumbtoolkit/browser-ui-vue2'

    import { TABLE, VIEW } from "../constants"

    export default {
        mixins:[ SurfaceDrop ],
        data:function() {
            return {
                data:[
                    { label:"Table", type:TABLE },
                    { label:"View", type:VIEW}
                ]
            };
        }
    }

</script>

