<template>
    <div class="jtk-chatbot-input" data-jtk-target="true">
        <div class="jtk-delete"></div>
        {{obj.message}}
        <textarea rows="5" cols="10" :placeholder="obj.prompt"/>
        <div class="connect" data-jtk-source="true"/>
    </div>
</template>
<script>
    import { defineComponent } from "vue";
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export default defineComponent({
        mixins: [BaseNodeComponent],
        components: {},
        methods: {}
    })
</script>
