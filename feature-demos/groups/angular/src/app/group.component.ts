import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"



@Component({
  template:`<div data-jtk-target="true">
    <div class="group-title">
      {{obj['title']}}
      <button class="expand" (click)="this.toggleGroup()"></button>
      <button class="group-delete" (click)="this.removeNode()"></button>
    </div>
    <div data-jtk-group-content="true"></div>
    <div class="group-connect connect" data-jtk-source="true">
      <i class="fa fa-chain"></i>
    </div>
  </div>`
})
export class GroupComponent extends BaseNodeComponent {

  toggleGroup() {
    this.surface.toggleGroup(this.getNode().id)
  }
}
