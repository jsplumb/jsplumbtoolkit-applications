<script>

    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    export default {
        mixins:[BaseNodeComponent],
        props:["shapeLibrary", "anchorPositions"]
    }

</script>
<template>
    <div :style="{color:obj.textColor}" class="flowchart-object" data-jtk-target="true">
        <span>{{obj.text}}</span>
        <jsplumb-shape :obj="obj" :shape-library="shapeLibrary"></jsplumb-shape>
        <div v-for="anchor in anchorPositions"
             :class="'jtk-connect jtk-connect-' + anchor.id"
             :data-jtk-anchor-x="anchor.x"
             :data-jtk-anchor-y="anchor.y"
             :data-jtk-orientation-x="anchor.ox"
             :data-jtk-orientation-y="anchor.oy"
             data-jtk-source="true"
             data-jtk-port-type="source"></div>
        <div class="node-delete node-action delete"></div>
    </div>
</template>
