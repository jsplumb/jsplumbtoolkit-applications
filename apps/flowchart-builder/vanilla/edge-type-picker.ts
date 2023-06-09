import {
    AnchorLocations, BlankEndpoint, Connection,
    EdgePropertyMappings, EVENT_CONNECTION_CLICK, EVENT_TAP, EventManager,
    newBrowserJsPlumbInstance,
    StraightConnector
} from "@jsplumbtoolkit/browser-ui"

export class EdgeTypePicker {

    private eventManager:EventManager

    constructor(private container:HTMLElement, private mappings:EdgePropertyMappings, private onSelect:(value:string) => any) {
        this.eventManager = new EventManager()
        this.eventManager.on(container, EVENT_TAP, "div", (e:MouseEvent) => {
            const v = (e.target as HTMLElement).getAttribute("data-value")
            this.select(v)
        })
    }

    private entryMap:Map<string, {c:Connection, el:HTMLElement}> = new Map()

    render(property:string) {
        this.container.innerHTML = ''
        this.container.style.display="flex"
        this.container.style.flexDirection="column"
        this.container.style.flexGrow="1"
        const propertyMappings = this.mappings.find(m => m.property === property)
        const jp = newBrowserJsPlumbInstance({container:this.container})

        jp.bind(EVENT_CONNECTION_CLICK, (p) => {
            this.select(p.data.id)
        })

        if (propertyMappings != null) {
            for(let value in propertyMappings.mappings) {
                const mapping = propertyMappings.mappings[value]
                const d = document.createElement("div")
                d.style.width = "100%"
                d.style.height = "20px"
                d.style.position = "relative"
                d.style.marginTop = "10px"
                d.setAttribute("data-value", value)

                const d1 = document.createElement("div")
                d1.style.left = "0"
                d1.style.height = "20px"
                d1.style.position = "absolute"
                d.appendChild(d1)

                const d2 = document.createElement("div")
                d2.style.right = "0"
                d2.style.height = "20px"
                d2.style.position = "absolute"
                d.appendChild(d2)

                const c = jp.connect({
                    source:d1,
                    target:d2,
                    connector:StraightConnector.type,
                    overlays:mapping.overlays,
                    cssClass:mapping.cssClass,
                    endpoint:BlankEndpoint.type,
                    anchor:AnchorLocations.Center,
                    data:{id:value}
                })

                this.entryMap.set(value, {c, el:d})

                this.container.appendChild(d)
            }
        }
    }

    select(value:string) {
        this.onSelect && this.onSelect(value)
    }

}
