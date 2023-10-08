<template>
    <div class="jtk-chatbot-choice" data-jtk-target="true">
        <div class="jtk-delete"></div>
        {{obj.message}}
        <div class="jtk-choice-add"></div>
        <div class="jtk-chatbot-choice-option" v-for="c in obj.choices" :key="c.id" v-bind:obj="c" v-bind:vertex="getNode()"
             data-jtk-source="true"
             data-jtk-port-type="choice"
             :data-jtk-port="c.id">
            {{c.label}}
            <div class="jtk-choice-delete"></div>
        </div>
    </div>
</template>
<script>
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue2'

    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export default {
        mixins: [BaseNodeComponent],
        components: {},
        methods: {}
    }
</script>
