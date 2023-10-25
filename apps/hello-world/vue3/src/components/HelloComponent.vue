<script>
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    import { defineComponent } from "vue"

    export default defineComponent({
        mixins: [BaseNodeComponent],
        components: {},
        methods: {
        }
    })
</script>
<template>
    <div class="hello-node">{{obj.label}}</div>
</template>
