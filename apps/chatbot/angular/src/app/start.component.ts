import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`<div class="jtk-chatbot-start">
    <div class="jtk-delete" (click)="removeNode()"></div>
    <div class="connect" data-jtk-source="true"></div>
  </div>`
})
export class StartComponent extends BaseNodeComponent {

}
