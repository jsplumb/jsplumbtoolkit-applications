/**

 This module contains the mappings for the various edge types.

 */

import {
    ARROW_LENGTH,
    ARROW_WIDTH,
    CLASS_DASHED_EDGE,
    EDGE_TYPE_BOTH_ARROWS, EDGE_TYPE_DASHED,
    EDGE_TYPE_PLAIN,
    EDGE_TYPE_SOURCE_ARROW,
    EDGE_TYPE_TARGET_ARROW,
    PROPERTY_LINE_STYLE
} from "./constants";
import {ArrowOverlay} from "@jsplumbtoolkit/browser-ui";

export default function edgeMappings(arrowWidth?:number, arrowLength?:number) {

    arrowWidth = arrowWidth || ARROW_WIDTH
    arrowLength = arrowLength || ARROW_LENGTH

    return [
        {
            property:PROPERTY_LINE_STYLE,
            mappings:{
                [EDGE_TYPE_SOURCE_ARROW]:{
                    overlays:[ { type:ArrowOverlay.type, options:{location:0, direction:-1, width:arrowWidth, Length:arrowLength} } ]
                },
                [EDGE_TYPE_TARGET_ARROW]:{
                    overlays:[ { type:ArrowOverlay.type, options:{location:1, width:arrowWidth, length:arrowLength} } ]
                },
                [EDGE_TYPE_BOTH_ARROWS]:{
                    overlays:[ {
                        type:ArrowOverlay.type,
                        options:{
                            location:1,
                            width:arrowWidth,
                            length:arrowLength
                        }
                    }, {
                        type:ArrowOverlay.type,
                        options:{
                            location:0,
                            direction:-1,
                            width:arrowWidth,
                            length:arrowLength
                        }
                    } ]
                },
                [EDGE_TYPE_PLAIN]:{},
                [EDGE_TYPE_DASHED]:{
                    cssClass:CLASS_DASHED_EDGE
                }
            }
        }
    ]

}
