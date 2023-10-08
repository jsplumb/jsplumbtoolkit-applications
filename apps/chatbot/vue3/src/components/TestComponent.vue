<template>
    <div class="jtk-chatbot-test" data-jtk-target="true">
        <div class="jtk-delete"></div>
        {{obj.message}}
        <div class="jtk-test-add" v-on:click="addTest()"></div>
        <div class="jtk-chatbot-choice-option" v-for="c in obj.choices" :key="c.id" v-bind:obj="c" v-on:click="editTest(c.id)"
             data-jtk-source="true"
             data-jtk-port-type="choice"
             :data-jtk-port="c.id">
            {{c.label}}
            <div class="jtk-choice-delete" v-on:click="deleteTest(c.id)"></div>
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
            addTest:function() {
                const t = this.getToolkit()
                t.setSelection(t.addPort(this.getNode(), {
                    id:uuid(),
                    label:"Result"
                }))
            },
            deleteTest:function(id) {
                this.getToolkit().removePort(this.getNode(), id)
            },
            editTest:function(id) {
                this.getToolkit().setSelection(this.getNode().getPort(id))
            }
        }
    })
</script>
