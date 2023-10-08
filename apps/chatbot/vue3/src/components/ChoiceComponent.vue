<template>
    <div class="jtk-chatbot-choice" data-jtk-target="true">
        <div class="jtk-delete"></div>
        {{obj.message}}
        <div class="jtk-choice-add" v-on:click="addChoice()"></div>
        <div class="jtk-chatbot-choice-option" v-for="c in obj.choices" :key="c.id" v-bind:obj="c" v-on:click="editChoice(c.id)"
             data-jtk-source="true"
             data-jtk-port-type="choice"
             :data-jtk-port="c.id">
            {{c.label}}
            <div class="jtk-choice-delete" v-on:click="deleteChoice(c.id)"></div>
        </div>
    </div>
</template>
<script>
    import { defineComponent } from "vue";
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export default defineComponent({
        mixins: [BaseNodeComponent],
        components: {},
        methods: {
            addChoice:function() {
                const t = this.getToolkit()

                t.setSelection(t.addPort(this.getNode(), {
                    id:uuid(),
                    label:"Choice"
                }))
            },
            deleteChoice:function(id) {
                this.getToolkit().removePort(this.getNode(), id)
            },
            editChoice:function(id) {
                this.getToolkit().setSelection(this.getNode().getPort(id))
            }
        }
    })
</script>
