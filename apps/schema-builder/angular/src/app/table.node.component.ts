
import {Component} from "@angular/core"
import { uuid } from "@jsplumbtoolkit/browser-ui"
import {BaseEditableNodeComponent} from "./base.editable.node"
import {DATATYPE_VARCHAR} from "./constants"


@Component({
  template:`<div class="jtk-schema-table jtk-schema-element">
    <div class="jtk-schema-element-name">
      <div class="jtk-schema-delete jtk-schema-delete-vertex" title="Click to delete" (click)="removeNode()"></div>
      <span>{{ obj['name'] }}</span>
      <div class="jtk-schema-buttons">
        <div class="jtk-schema-edit-name jtk-schema-edit" title="Click to edit table name" (click)="editName()"></div>
        <div class="jtk-schema-new-column jtk-schema-add" title="Click to add a new column" (click)="addColumn()"></div>
      </div>
    </div>
    <div class="jtk-schema-columns">
      <db-column *ngFor="let column of obj['columns']" [obj]="column" [parent]="this"></db-column>
    </div>
  </div>
  `
})
export class TableNodeComponent extends BaseEditableNodeComponent {

  addColumn():void {
    //
    // this is a helper method provided by the Toolkit's `BaseNodeComponent`. It will add a new port to the data
    // for the node this component represents.  Under the hood the Toolkit does two things in response to this:
    //
    // 1. It uses the `portDataProperty` that we set on the `toolkitParams` in AppComponent to find the array in
    // each node's backing data into which to write the a JS object for this port. Angular then discovers that
    // via change detection and renders a column component for it.
    //
    // 2. it registers the new port data on the node in the Toolkit's data model.
    //
    this.addNewPort("column",{
      id:uuid(),
      name:"new column",
      datatype:DATATYPE_VARCHAR
    })
  }
}
