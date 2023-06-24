
import {BaseEditableNodeComponent} from "./base.editable.node";
import {Component} from "@angular/core";

@Component({
  template:`<div class="jtk-schema-view jtk-schema-element">
    <div class="jtk-schema-element-name">
      <div class="jtk-schema-view-delete jtk-schema-delete jtk-schema-delete-vertex" title="Click to delete" (click)="removeNode()"></div>
      <span>{{obj['name']}}</span>
      <div class="jtk-schema-buttons">
        <div class="jtk-schema-edit-name jtk-schema-edit" title="Click to edit view" (click)="editName()"></div>
      </div>
    </div>
    <div class="jtk-schema-view-details">{{obj['query']}}</div>
  </div>
  `
})
export class ViewNodeComponent extends BaseEditableNodeComponent { }
