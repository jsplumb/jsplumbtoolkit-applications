import {
    EDGE_TYPE_BOTH_ARROWS,
    EDGE_TYPE_DASHED,
    EDGE_TYPE_PLAIN,
    EDGE_TYPE_SOURCE_ARROW,
    EDGE_TYPE_TARGET_ARROW
} from "./constants";

export const DEFAULT_LINE_STYLES = [
    {
        id:EDGE_TYPE_SOURCE_ARROW,
        svg:`<svg:svg viewBox="0 0 80 40">
                <svg:path d="M 0 20 L 80 20" stroke-width="1" stroke="black" fill="none"/>
                <svg:path d="M 0 20 L 10 15 L 10 25 Z" stroke-width="1" fill="black"/>
             </svg:svg>`
    },
    {
        id:EDGE_TYPE_TARGET_ARROW,
        svg:`<svg:svg viewBox="0 0 80 40">
                <svg:path d="M 0 20 L 80 20" stroke-width="1" stroke="black" fill="none"/>
                <svg:path d="M 80 20 L 70 15 L 70 25 Z" stroke-width="1" fill="black"/>
             </svg:svg>`
    },
    {
        id:EDGE_TYPE_BOTH_ARROWS,
        svg:`<svg:svg viewBox="0 0 80 40">
                <svg:path d="M 0 20 L 80 20" stroke-width="1" stroke="black" fill="none"/>
                <svg:path d="M 0 20 L 10 15 L 10 25 Z" stroke-width="1" fill="black"/>
                <svg:path d="M 80 20 L 70 15 L 70 25 Z" stroke-width="1" fill="black"/>
             </svg:svg>`
    },
    {
        id:EDGE_TYPE_PLAIN,
        svg:`<svg:svg viewBox="0 0 80 40">
                <svg:path d="M 0 20 L 80 20" stroke-width="1" stroke="black" fill="none"/>
             </svg:svg>`
    },
    {
        id:EDGE_TYPE_DASHED,
        svg:`<svg:svg viewBox="0 0 80 40">
                <svg:path d="M 0 20 L 80 20" stroke-width="1" stroke="black" fill="none" stroke-dasharray="2 0 2 2"/>
             </svg:svg>`
    }
]
