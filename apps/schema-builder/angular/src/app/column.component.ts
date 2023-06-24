
import {Component, ElementRef} from "@angular/core";
import {BasePortComponent} from "@jsplumbtoolkit/browser-ui-angular";

@Component({
  selector:"db-column",
  template:`<!--
  Explanation of each attribute:

  primary-key : used by this demonstration to apply styles via CSS to a table's primary key
  data-jtk-port : the associated port id in the model for the column (which is the column's id)
  data-jtk-source : informs the Toolkit that the element is a connection drag source
  data-jtk-target: informs the Toolkit that the element is a connection drag target

-->
  <div class="jtk-schema-table-column" attr.data-type="{{obj['datatype']}}"
       attr.data-primary-key="{{obj['primaryKey']}}" attr.data-jtk-port="{{obj['id']}}"
       data-jtk-source="true" attr.data-jtk-scope="{{obj['datatype']}}" data-jtk-target="true">

    <div class="jtk-schema-table-column-delete jtk-schema-delete" (click)="removePort()"></div>

    <div><span>{{obj['name']}}</span></div>

    <div class="jtk-schema-table-column-edit jtk-schema-edit" (click)="editName()"></div>

  </div>
  `
})
export class ColumnComponent extends BasePortComponent {

  constructor(el: ElementRef) {
    super(el);
  }

  editName():void {
    this.parent.toolkit.setSelection(this.getPort())
  }
}
