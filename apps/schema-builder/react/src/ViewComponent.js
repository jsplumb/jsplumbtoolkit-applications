import React from "react"


export default function ViewComponent({ctx}) {
    const { vertex, surface, toolkit } = ctx

    function deleteView() {
        toolkit.removeNode(vertex)
    }

    function editView() {
        toolkit.setSelection(vertex)
    }

    return (<div className="jtk-schema-view jtk-schema-element">
            <div className="jtk-schema-element-name">
                <div className="jtk-schema-view-delete jtk-schema-delete jtk-schema-delete-vertex" title="Delete view" onClick={() => deleteView()}/>
                <span>{vertex.data.name}</span>
                <div className="jtk-schema-buttons">
                    <div className="jtk-schema-edit-name jtk-schema-edit" title="Edit view" onClick={() => editView() }/>
                </div>
            </div>
            <div className="jtk-schema-view-details">{vertex.data.query}</div>
    </div>)
}
