import {DEFAULT, EVENT_TAP} from "@jsplumbtoolkit/browser-ui";

/**
 * Generates a view, shared by the main canvas and the popups
 * @param tk The underlying Toolkit.
 * @param onSelect Optional, supplied by the popups. Invoked when a node is selected, if present.
 * @return a View spec.
 */
export default function(tk, onSelect) {
    return {
        nodes:{
            [DEFAULT]:{
                events:{
                    [EVENT_TAP]:(p) => {
                        tk.setSelection(p.obj)
                        onSelect && onSelect(p.obj)
                    }
                }
            },
            base:{
                parent:DEFAULT,
                template:`<div class="base">{{label}}</div>`
            },
            formula:{
                parent:DEFAULT,
                // NOTE here we use the `formula` custom tag that is specified in `formula-tag.js`
                template:`<div class="formula"><div class="title">{{label}}</div><formula/></div>`
            }
        }
    }
}
