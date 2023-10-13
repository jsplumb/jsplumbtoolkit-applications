import {
    EVENT_SELECT,
    EVENT_TAP,
    Selection,
    AnchorLocations,
    BlankEndpoint,
    EVENT_CLICK
} from "@jsplumbtoolkit/browser-ui";

import generateView from "./view";
import formulaTag from './formula-tag'

/**
 * Base for all popups, manages the canvas and selection events. This class is effectively
 * abstract - child classes provide a `generator` for its dataset and the layout spec they wish to use.
 */
export class BasePopup {

    toolkit
    surface
    focus
    selection

    visible = true

    parentObjects = []
    childObjects = []
    siblingObjects = []

    constructor(toolkit, surface, {el, toggle}) {
        this.toolkit = toolkit
        this.container = el
        this.toggle = toggle

        surface.on(el.querySelector(".title"), EVENT_TAP, () => {
            this.setVisible(!this.visible)
        })

        surface.on(toggle, EVENT_CLICK, () => {
            this.setVisible(!this.visible)
        })

        toolkit.bind(EVENT_SELECT, (o) => {
            this.focus = o.obj

            this.parentObjects.length = 0
            this.siblingObjects.length = 0
            const e = this.focus.getTargetEdges()[0]
            if (e != null) {
                this.parent = e.source
                this.parentEdge = e
                this.parentObjects.push(e.source)
                this.parentObjects.push(e)

                this.siblingObjects.push(...e.source.getSourceEdges().map(e => e.target))
            }

            this.childObjects.length = 0
            this.focus.getSourceEdges().forEach(edge => {
                this.childObjects.push(edge.target)
                this.childObjects.push(edge)
            })

            this.refresh()
        })

        this.selection = new Selection(toolkit, {
            generator:this.generator()
        })

        this.surface = toolkit.render(el.querySelector(".content"), {
            tags:{
                formula: formulaTag
            },
            dataSource:this.selection,
            view:generateView(toolkit, (p) => surface.centerOn(p)),
            defaults:{
                anchor:[AnchorLocations.Bottom, AnchorLocations.Top],
                endpoint:BlankEndpoint.type
            },
            layout:this.getLayout(),
            wheel:{
                zoom:false
            },
            enablePan:false

        })
    }

    setVisible(state) {
        this.visible = state
        this.toggle.setAttribute("data-hidden", !state)
        const height = state ? "350px" : "40px"
        this.container.animate({
            height:height
        }, 150).finished.then(() => {
            this.container.style.height = height
            if (state) {
                this.refresh()
            }
        })
    }

    refresh() {
        this.selection.reload()
        this.surface.relayout()
        this.surface.zoomToFit()
    }
}
