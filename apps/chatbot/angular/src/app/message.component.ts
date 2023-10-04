import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`<div class="jtk-chatbot-message" data-jtk-target="true">
    <div class="jtk-delete" (click)="removeNode()"></div>
    {{obj['message']}}
    <div class="connect" data-jtk-source="true"></div>
  </div>`
})
export class MessageComponent extends BaseNodeComponent { }
