<script>
    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    function remove() {
        toolkit.removeNode(vertex)
    }
</script>


<div class="jtk-chatbot-start">
    <div class="jtk-delete" on:click={remove}></div>
    <div class="connect" data-jtk-source="true"/>
</div>
