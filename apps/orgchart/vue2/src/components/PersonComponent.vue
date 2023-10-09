<template>
    <div>
        <img :src="getImage()" :alt="obj.name"/>
        <div>
            <strong>{{obj.name}}</strong>
            <span>{{obj.title}}</span>
        </div>
    </div>
</template>
<script>
    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue2'

    export default {
        mixins: [BaseNodeComponent],
        components: {},
        methods: {
            getImage:function() {
                return `/avatars/${this.obj.img}`
            }
        }
    }
</script>
