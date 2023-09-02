import {
    AbstractLayout, isNode, Layouts, ParentRelativePlacementStrategy
} from "@jsplumbtoolkit/browser-ui"

import {LEFT, MAIN, RIGHT} from "./definitions"


/**
 * Places the focus vertex in the center of the canvas and then branches out to the left and right with children of the focus.
 *
 */
export class MindmapLayout extends AbstractLayout {

    focusVertex;

    constructor(options) {
        super(options)
    }

    begin(toolkit, parameters) {
        const focusCandidates = toolkit.filter(o => isNode(o) && o.data.type === MAIN)
        if (focusCandidates.getNodeCount() > 0) {
            this.focusVertex = focusCandidates.getNodeAt(0)
        } else {
            this.focusVertex = null
        }
    }

    end(toolkit, parameters, wasMagnetized) { }

    getDefaultParameters() {
        return {
            padding:{x:100, y:100}
        };
    }

    reset() { }

    step(toolkit, parameters) {

        if (this.focusVertex != null) {

            //
            // We use a helper class here to draw out the left/right trees - ParentRelativePlacementStrategy.
            //
            const _preparePlacementStrategy = (dir) => {
                return new ParentRelativePlacementStrategy(toolkit, {
                    rootNode:this.focusVertex.data,
                    idFunction:(d) => d.id,
                    sizeFunction:(id) => {
                        return this._getSize(id)
                    },
                    childVerticesFunction:(d) => {
                        if (d.type === MAIN) {
                            return d[dir] || []
                        } else {
                            return d.children || []
                        }
                    },
                    padding:{x:250, y:100},
                    absolutePositionFunction:(v) => null,
                    axisIndex:1
                })
            }

            const rightPositions = _preparePlacementStrategy(RIGHT).execute()
            rightPositions.forEach((info, id) => {
                console.log(id, info.position)
                this.setPosition(id, info.position.x, info.position.y)
            })

            const leftPositions = _preparePlacementStrategy(LEFT).execute()
            leftPositions.forEach((info, id) => {
                this.setPosition(id, info.position.x * -1, info.position.y)
            })
        }


        this.done = true

    }

    canMagnetize(id) {
        return false;
    }
}

Layouts.register(MindmapLayout.type, MindmapLayout)

