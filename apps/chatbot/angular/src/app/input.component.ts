import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`<div class="jtk-chatbot-input" data-jtk-target="true">
    <div class="jtk-delete" (click)="removeNode()"></div>
    {{obj['message']}}
    <textarea rows="5" cols="10" placeholder="{{obj['prompt']}}"></textarea>
    <div class="connect" data-jtk-source="true"></div>
  </div>`
})
export class InputComponent extends BaseNodeComponent {

}
