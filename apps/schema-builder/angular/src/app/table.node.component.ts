
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
    this.addNewPort("column",{
      id:uuid(),
      name:"new column",
      datatype:DATATYPE_VARCHAR
    })
  }
}
