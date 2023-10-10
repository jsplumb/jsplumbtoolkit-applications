<template>

        <img :src="getImage()" :alt="obj.name"/>
        <div>
            <strong>{{obj.name}}</strong>
            <span>{{obj.title}}</span>
        </div>

</template>
<script>
    import { defineComponent } from "vue"
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    export default defineComponent({
        mixins: [BaseNodeComponent],
        components: {},
        methods: {
            getImage:function() {
                return `/avatars/${this.obj.img}`
            }
        }
    })
</script>
