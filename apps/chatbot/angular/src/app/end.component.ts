import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`<div class="jtk-chatbot-end" data-jtk-target="true">
    <div class="jtk-delete" (click)="removeNode()"></div>
  </div>`
})
export class EndComponent extends BaseNodeComponent {

}
