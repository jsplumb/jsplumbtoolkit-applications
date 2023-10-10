import {
    VanillaInspector, EventManager, EVENT_CLICK
} from "@jsplumbtoolkit/browser-ui"


/**
 * Inspector for chatbot nodes.
 */
export class OrgchartInspector extends VanillaInspector {

    retrieveDirectReports(person) {
        return person.getSourceEdges().map(e => e.target)
    }

    getManager(person) {
        return person.getTargetEdges().map(e => e.source)[0]
    }

    drawPersonCard(person) {
        return `
            <a class="jtk-orgchart-inspector-person" href="#${person.data.id}" 
                    data-id="${person.data.id}">
                <img src="avatars/${person.data.img}" alt="${person.data.name}"/>
                <div>
                    ${person.data.name}
                    <span>${person.data.title}</span>
                </div>
            </a>`
    }

    constructor(options) {
        super(Object.assign(options, {

            templateResolver:(obj) => {

                const reports = this.retrieveDirectReports(obj)
                const manager = this.getManager(obj)

                const out = `<div class="jtk-orgchart-inspector">

                    <h1>{{name}}</h1>
                    <h2>{{title}}</h2>` +

                    (reports.length > 0 ? `<h5>Reports:</h5>` +
                    reports.map(r => this.drawPersonCard(r)).join('') : '') +


                    (manager != null ? `<h5>Reports to:</h5>${this.drawPersonCard(manager)}` : '' ) +

                    `</div>`

                return out
            },
            cacheTemplates:false
        }))

        const em = new EventManager()
        em.on(this.inspector.container, EVENT_CLICK, "a", (p) => {
            const id = p.target.getAttribute("data-id") || p.target.parentNode.getAttribute("data-id")
            options.onPersonSelected(id)
        })

    }
}
