import {GeneratedGridBackground} from "@jsplumbtoolkit/browser-ui";

export const EDGE_TYPE_SOURCE_ARROW = "sourceArrow"
export const EDGE_TYPE_TARGET_ARROW = "targetArrow"
export const EDGE_TYPE_BOTH_ARROWS = "bothArrows"
export const EDGE_TYPE_PLAIN = "plain"
export const EDGE_TYPE_DASHED = "dashed"

export const PROPERTY_LINE_STYLE = "lineStyle"
export const PROPERTY_FILL = "fill"
export const PROPERTY_LABEL = "label"
export const PROPERTY_COLOR = "color"
export const PROPERTY_TEXT_COLOR = "textColor"

export const CLASS_EDGE_LABEL = "jtk-flowchart-edge-label"
export const CLASS_DASHED_EDGE = "jtk-flowchart-dashed-edge"
export const CLASS_FLOWCHART_EDGE = "jtk-flowchart-edge"

export const ARROW_WIDTH = 20
export const ARROW_LENGTH = 15

/**
 * Default fill color for shapes.
 */
export const DEFAULT_FILL = "#FFFFFF"

/**
 * Default stroke color for edges
 */
export const DEFAULT_STROKE = "#000000"

/**
 * Default text color
 */
export const DEFAULT_TEXT_COLOR = "#000000"

export const DEFAULT_OUTLINE_WIDTH = 2

export const GRID_SIZE = {
    w:50,
    h:50
}

export const GRID_BACKGROUND_OPTIONS = {
    dragOnGrid:true,
    showGrid:true,
    showBorder:false,
    autoShrink:true,
    minWidth:10000,
    maxWidth:null,
    minHeight:10000,
    maxHeight:null,
    showTickMarks:false,
    type:GeneratedGridBackground.type
}
