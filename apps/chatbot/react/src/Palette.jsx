import React from 'react';

import {SurfaceDropComponent} from '@jsplumbtoolkit/browser-ui-react';

import { nodeTypes } from "./constants";

class Palette extends SurfaceDropComponent {
    render() {
        return nodeTypes.map(nt => <div key={nt.type} className="jtk-chatbot-palette-item" data-type={nt.type}>{nt.label}</div>)
    }
}

export default Palette;
