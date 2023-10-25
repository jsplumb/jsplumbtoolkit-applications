<script>
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue2'

    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export default {
        mixins: [BaseNodeComponent],
        components: {},
        methods: {
        }
    }
</script>
<template>
    <div class="hello-node">{{obj.label}}</div>
</template>
