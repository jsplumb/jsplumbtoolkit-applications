import React from 'react';

import {SurfaceDropComponent} from '@jsplumbtoolkit/browser-ui-react';

class DragDropNodeSource extends SurfaceDropComponent {
    render() {
        return [
            <div data-type="table" title="Drag to add new" className="jtk-schema-palette-item" key={"table"}><i className="fa fa-table btn-icon-margin"></i>Table</div>,
            <div data-type="view" title="Drag to add new" className="jtk-schema-palette-item" key={"view"}><i className="fa fa-eye btn-icon-margin"></i>View</div>
        ];
    }
}

export default DragDropNodeSource;
