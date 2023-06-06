<script>

    import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'

    export default {
        mixins:[BaseNodeComponent],
        props:["shapeLibrary"]
    }

</script>
<template>
    <div :style="{width:obj.width + 'px', height:obj.height + 'px', color:obj.textColor}" class="flowchart-object" data-jtk-target="true" data-jtk-target-port-type="target">
        <span>{{obj.text}}</span>
        <jsplumb-shape :obj="obj" :shape-library="shapeLibrary"></jsplumb-shape>
        <div class="jtk-connect" data-jtk-anchor-x="0" data-jtk-anchor-y="0.5" data-jtk-orientation-x="-1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style="left:0;top:50%;transform: translate(-50%, -50%);"></div>
        <div class="jtk-connect" data-jtk-anchor-x="1" data-jtk-anchor-y="0.5" data-jtk-orientation-x="1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source" style="right:0;top:50%;transform: translate(50%, -50%);"></div>
        <div class="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="0" data-jtk-orientation-x="0"  data-jtk-orientation-y="-1" data-jtk-source="true" data-jtk-port-type="source" style="left:50%;top:0;transform: translate(-50%, -50%);"></div>
        <div class="jtk-connect" data-jtk-anchor-x="0.5" data-jtk-anchor-y="1" data-jtk-orientation-x="0"  data-jtk-orientation-y="1" data-jtk-source="true" data-jtk-port-type="source" style="left:50%;bottom:0;transform: translate(-50%, 50%);"></div>
        <div class="node-delete node-action delete"></div>
    </div>
</template>
