<script>
    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    function remove() {
        toolkit.removeNode(vertex)
    }
</script>

<div class="jtk-chatbot-input" data-jtk-target="true">
    <div class="jtk-delete" on:click={remove}></div>
    {data.message}
    <textarea rows="5" cols="10" placeholder="{data.prompt}"></textarea>
    <div class="connect" data-jtk-source="true"></div>
</div>
