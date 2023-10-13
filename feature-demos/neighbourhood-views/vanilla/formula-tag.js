/**
 * Custom tag used to render the formula in nodes that have one. The `formula` member from the node's data is split
 * with a regex and then re-assembled into HTML. The tag then injects it as the innerHTML of the tag's DOM element.
 *
 * In this tag we use the same method for rendering as for updating, but in more advanced scenarios you may not want to
 * do that.
 *
 * Note that custom tags are only something you will use if you use the vanilla Toolit. If you use a library
 * integration then you can use a component from the library instead of this.
 *
 * @param el
 * @param data
 * @param rotorsInstance
 * @param parentElement
 */

function render(el, data, rotorsInstance, parentElement) {
    const parsedFormula = (data.formula || '').match(/([A-Z]+)|([0-9]+)|-/g).map(c => isNaN(parseInt(c)) ? `<span data-c="${c}">${c}</span>` : `<sub>${c}</sub>`).join('')
    el.innerHTML = parsedFormula
}

export default {
    template:'<div class="formula-value"/>',
    rendered:render,
    updated:render
}
