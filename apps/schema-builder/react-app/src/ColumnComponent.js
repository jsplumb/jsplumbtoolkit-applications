import React from "react"

export default function ColumnComponent({toolkit, surface, column, vertex}) {

    function deleteColumn() {
        toolkit.removePort(vertex, column)
    }

    function editColumn() {
        toolkit.setSelection(column)
    }


    return <>
            <div className="jtk-schema-table-column" data-type={column.datatype} data-primary-key={(column.primaryKey || false).toString()} data-jtk-port={column.id} data-jtk-scope={column.datatype} data-jtk-source={true} data-jtk-target={true}>
                <div className="jtk-schema-table-column-delete jtk-schema-delete" onClick={() => deleteColumn()}/>
                <div><span>{column.name}</span></div>
                <div className="jtk-schema-table-column-edit jtk-schema-edit" onClick={() => editColumn()}/>
        </div>
    </>
}
