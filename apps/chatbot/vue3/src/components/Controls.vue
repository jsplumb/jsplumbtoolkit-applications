<template>
    <div class="jtk-controls" ref="container" can-undo="false" can-redo="false">
        <i class="jtk-pan-mode jtk-selected-mode" data-mode="pan" title="Pan Mode" v-on:click="panMode()"></i>
        <i class="jtk-select-mode" data-mode="select" title="Select Mode" v-on:click="selectMode()"></i>
        <i class="jtk-zoom-to-fit" data-reset title="Zoom To Fit" v-on:click="zoomToFit()"></i>
        <i class="jtk-undo" data-undo title="Undo last action" v-on:click="undo()"></i>
        <i class="jtk-redo" data-redo title="Redo last action" v-on:click="redo()"></i>
        <i class="jtk-clear-dataset" data-clear title="Clear" v-on:click="clear()"></i>
    </div>
</template>

<script>

    import { defineComponent } from "vue";
    import { loadSurface } from "@jsplumbtoolkit/browser-ui-vue3";
    import { EVENT_UNDOREDO_UPDATE, EVENT_CANVAS_CLICK, SurfaceMode } from "@jsplumbtoolkit/browser-ui"


    // a wrapper around loadSurface, which expects a callback, as the surface may or may not have been
    // initialised when calls are made to it.
    function _getSurface(cb) {
        loadSurface(surfaceId, cb)
    }

    let container;
    let surfaceId;

    export default defineComponent({
        props:{
            surfaceId:{
                type:String
            }
        },
        methods:{
            panMode:function() {
                _getSurface((s) => s.setMode(SurfaceMode.PAN))
            },
            selectMode:function() {
                _getSurface((s) => s.setMode(SurfaceMode.SELECT))
            },
            zoomToFit:function() {
                debugger
                _getSurface((s) => s.zoomToFit())
            },
            undo:function() {
                _getSurface((s) =>
                    s.toolkitInstance.undo())
            },
            redo:function() {
                _getSurface((s) => s.toolkitInstance.redo())
            },
            clear: function() {
                _getSurface((s) => {
                    const t = s.toolkitInstance;
                    if (t.getNodeCount() === 0 || confirm("Clear canvas?")) {
                        t.clear();
                    }
                });
            }
        },
        mounted() {

            surfaceId = this.surfaceId;
            container = this.$refs.container;
            _getSurface((surface) => {

                surface.toolkitInstance.bind(EVENT_UNDOREDO_UPDATE, (state) => {
                    container.setAttribute("can-undo", state.undoCount > 0 ? "true" : "false")
                    container.setAttribute("can-redo", state.redoCount > 0 ? "true" : "false")
                })

                surface.bind(EVENT_CANVAS_CLICK, () => {
                    surface.toolkitInstance.clearSelection();
                });
            });
        }
    })

</script>
