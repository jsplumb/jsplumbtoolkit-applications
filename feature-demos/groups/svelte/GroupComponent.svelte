<script>
    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    function removeGroup() {
        toolkit.removeGroup(vertex, true)
    }

</script>

<div data-jtk-target="true">
    <div class="group-title">
        {vertex.data.title}
        <button class="expand" on:click={() => surface.toggleGroup(vertex)}></button>
        <button class="group-delete" on:click={() => removeGroup()}></button>
    </div>
    <div data-jtk-group-content="true"></div>
    <div class="group-connect connect" data-jtk-source="true">
        <i class="fa fa-chain"></i>
    </div>
</div>
