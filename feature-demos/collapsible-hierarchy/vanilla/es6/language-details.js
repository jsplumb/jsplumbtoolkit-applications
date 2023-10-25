
const CLASS_SELECTED_LANGUAGE = "jtk-selected-language"

/**
 * A helper class to manage the iframe that shows language links. Also handles the
 * highlight of the current node.
 */
export class LanguageDetailsView {

    current
    iframe
    callback
    surface

    constructor(iframe, surface, callback) {

        this.iframe = iframe
        this.current = null
        this.callback = callback
        this.surface = surface
    }

    _reset() {
        if (this.current != null) {
            this.current.el.classList.remove(CLASS_SELECTED_LANGUAGE)
        }
    }

    clear() {
        this._reset()
        this.current = null
        this.callback(null)
    }

    setCurrent(info) {
        this._reset()
        this.current = info
        this._showDetails(info.obj)
        this.current.el.classList.add(CLASS_SELECTED_LANGUAGE)
    }

    _showDetails(node) {
        if (node.data.link != null) {
            this.iframe.contentWindow.location.href = node.data.link
        }
        this.callback(node.data.link)
    }

    panToCurrent() {
        if (this.current != null) {
            this.surface.centerOnAndZoom(this.current.id, 0.05)
        }
    }
}
