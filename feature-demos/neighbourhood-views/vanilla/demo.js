import {
    SegmentedConnector,
    ready,
    newInstance,
    HierarchyLayout,
    registerParser,
    AnchorLocations,
    BlankEndpoint,
    ElementDragger
} from "@jsplumbtoolkit/browser-ui"
import {parser} from "./loader";
import data from './dataset'
import {SuccessorsPopup} from "./successors";
import {PredecessorsPopup} from "./predecessors";
import { NeighboursPopup} from "./neighbours";
import { SiblingsPopup} from "./siblings-popup";

import generateView from './view'
import formulaTag from './formula-tag'

registerParser("chemicals", parser)

ready(() => {

    const tk = newInstance()
    tk.load({
        data,
        type:'chemicals'
    })

    const surface = tk.render(document.querySelector("#canvas"), {
        layout:{
            type:HierarchyLayout.type
        },
        tags:{
            formula:formulaTag
        },
        view:generateView(tk),
        defaults:{
            anchor:[AnchorLocations.Bottom, AnchorLocations.Top],
            endpoint:BlankEndpoint.type,
            connector:{
                type:SegmentedConnector.type,
                options:{
                    stub:10
                }
            }
        },
        consumeRightClick:false,
        zoomToFit:true
    })

    // get some element references
    const [ successors, predecessors, neighbours, siblings ] = [ "successors", "predecessors", "neighbours", "siblings"].map(e => {
        return {
            el:document.querySelector(`#${e}`),
            toggle:document.querySelector(`#toggle${e}`)
        }
    })

    // create the popups
    new SuccessorsPopup(tk, surface, successors)
    new PredecessorsPopup(tk, surface, predecessors)
    new NeighboursPopup(tk, surface, neighbours)
    new SiblingsPopup(tk, surface, siblings)

    // make all the popups draggable.
    new ElementDragger([successors.el, predecessors.el, neighbours.el, siblings.el])

})
