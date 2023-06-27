import React from 'react';

import {SurfaceDropComponent} from '@jsplumbtoolkit/browser-ui-react';

class DragDropNodeSource extends SurfaceDropComponent {
    render() {
        return [
            <div data-type="table" title="Drag to add new" className="jtk-schema-palette-item" key={"table"}>Table</div>,
            <div data-type="view" title="Drag to add new" className="jtk-schema-palette-item" key={"view"}>View</div>
        ];
    }
}

export default DragDropNodeSource;
