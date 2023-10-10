<script>

    import { uuid } from "@jsplumbtoolkit/browser-ui"

    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    function remove() {
        toolkit.removeNode(vertex)
    }

    function addTest() {
        toolkit.addPort(vertex, {
            id:uuid(),
            label:"Result"
        })
    }

    function removeTest(id) {
        toolkit.removePort(vertex, id)
    }
</script>

<div class="jtk-chatbot-test" data-jtk-target="true">
    <div class="jtk-delete" on:click={remove}></div>
{data.message}
    <div class="jtk-choice-add" on:click={addTest}></div>
{#each data.choices as choice}
        <div class="jtk-chatbot-choice-option"
             data-jtk-source="true"
             data-jtk-port-type="choice"
             data-jtk-port={choice.id}>
            {choice.label}
            <div class="jtk-choice-delete" on:click={() => removeTest(choice.id)}></div>
    </div>
{/each}
        </div>
