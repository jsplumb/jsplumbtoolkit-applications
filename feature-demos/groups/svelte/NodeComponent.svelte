<script>

    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    function removeNode() {
        toolkit.removeNode(vertex)
    }

</script>

<div style="width:{vertex.data.w}px;height:{vertex.data.h}px;" data-jtk-target="true">
    {vertex.data.name}
    <div class="delete" title="Click to delete" on:click={() => removeNode()}/>
    <div class="connect" data-jtk-source="true"/>
</div>
