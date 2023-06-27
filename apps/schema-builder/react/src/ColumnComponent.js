import React from "react"

export default function ColumnComponent({toolkit, surface, data, vertex}) {

    const column = vertex.getPort(data.id)

    function deleteColumn() {
        toolkit.removePort(vertex, column)
    }

    function editColumn() {
        toolkit.setSelection(column)
    }

    return <>
            <div className="jtk-schema-table-column" data-type={data.datatype} data-primary-key={(data.primaryKey || false).toString()} data-jtk-port={column.id} data-jtk-scope={data.datatype} data-jtk-source={true} data-jtk-target={true}>
                <div className="jtk-schema-table-column-delete jtk-schema-delete" onClick={() => deleteColumn()}/>
                <div><span>{data.name}</span></div>
                <div className="jtk-schema-table-column-edit jtk-schema-edit" onClick={() => editColumn()}/>
        </div>
    </>
}
