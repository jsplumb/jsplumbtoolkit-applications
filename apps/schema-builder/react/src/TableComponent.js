import React from "react"

import { uuid } from "@jsplumbtoolkit/browser-ui"

import { datatypes } from "./definitions";

import ColumnComponent from './ColumnComponent'

export default function TableComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    function addColumn() {
        toolkit.addNewPort(vertex, "column", {
            id: uuid(),
            name: "new column",
            primaryKey: false,
            datatype: datatypes[0].id
        });
    }

    function deleteTable() {
        toolkit.removeNode(vertex)
    }

    function editTable() {
        toolkit.setSelection(vertex)
    }

    return (<div className="jtk-schema-table jtk-schema-element">
        <div className="jtk-schema-element-name">
            <div className="jtk-schema-delete jtk-schema-delete-vertex" title="Click to delete" onClick={() => deleteTable()}/>
            <span>{vertex.data.name}</span>
            <div className="jtk-schema-buttons">
                <div className="jtk-schema-edit-name jtk-schema-edit" title="Click to edit table name" onClick={() => editTable()}/>
                <div className="jtk-schema-new-column jtk-schema-add" title="Click to add a new column" onClick={() => addColumn()}/>
            </div>
        </div>
        <div className="jtk-schema-table-columns">
            { vertex.data.columns.map(c => <ColumnComponent data={c} key={c.id} toolkit={toolkit} surface={surface} vertex={vertex}/>) }
        </div>
    </div>)
}

/*
{ vertex.data.columns.map(c => <ColumnComponent data={c} key={c.id} toolkit={this.toolkit} surface={this.surface} vertex={vertex}/>) }
 */
