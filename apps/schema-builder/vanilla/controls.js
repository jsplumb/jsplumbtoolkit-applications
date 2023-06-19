import {EVENT_SURFACE_MODE_CHANGED, EVENT_TAP, EVENT_UNDOREDO_UPDATE} from "@jsplumbtoolkit/browser-ui";

/**
 * This is a helper class that renders a set of buttons you can use to control various aspects of the
 * demo.  It's not a core part of the Toolkit. But you're welcome to use this in your apps if you want to.
 */
export class SchemaBuilderControls {

    constructor(container, toolkit, renderer) {

        toolkit.bind(EVENT_UNDOREDO_UPDATE, function(state) {
            container.setAttribute("can-undo", state.undoCount > 0 ? "true" : "false");
            container.setAttribute("can-redo", state.redoCount > 0 ? "true" : "false");
        })

        renderer.on(container, EVENT_TAP, "[data-undo]",  function() {
            toolkit.undo()
        })

        renderer.on(container, EVENT_TAP, "[data-redo]", function() {
            toolkit.redo()
        })

        // listener for mode change on renderer.
        renderer.bind(EVENT_SURFACE_MODE_CHANGED, function(mode) {
            forEach(container.querySelectorAll("[data-mode]"), function(e) {
                renderer.removeClass(e, "selected-mode")
            })

            renderer.addClass(container.querySelector("[data-mode='" + mode + "']"), "selected-mode")
        })

        // pan mode/select mode
        renderer.on(container, EVENT_TAP, "[data-mode]", (e, eventTarget) => {
            renderer.setMode(eventTarget.getAttribute("data-mode"))
        });

        // on home button click, zoom content to fit.
        renderer.on(container, EVENT_TAP, "[data-reset]",  (e, eventTarget) => {
            toolkit.clearSelection()
            renderer.zoomToFit()
        })

        // on clear button, perhaps clear the Toolkit
        renderer.on(container, EVENT_TAP, "[data-clear]", (e, eventTarget) => {
            if (toolkit.getNodeCount() === 0 || confirm("Clear schema?")) {
                toolkit.clear()
            }
        })
    }
}
