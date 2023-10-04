import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import { uuid } from "@jsplumbtoolkit/browser-ui"

@Component({
  template:`<div class="jtk-chatbot-choice" data-jtk-target="true">
    <div class="jtk-delete" (click)="removeNode()"></div>
    {{obj['message']}}
    <div class="jtk-choice-add" (click)="addChoice()"></div>
    <div class="jtk-chatbot-choice-option" *ngFor="let choice of obj['choices']"
         data-jtk-source="true"
         data-jtk-port-type="choice"
         [attr.data-jtk-port]="choice['id']"
         (click)="inspectChoice(choice.id)">
      {{choice['label']}}
      <div class="jtk-choice-delete" (click)="removeChoice(choice.id)"></div>
    </div>
  </div>`
})
export class ChoiceComponent extends BaseNodeComponent {

  inspectChoice(id:string) {
    this.toolkit.setSelection(this.getNode().getPort(id))
  }

  addChoice() {
    this.toolkit.setSelection(this.toolkit.addPort(this.getNode(), {
      id:uuid(),
      label:"Choice"
    }))
  }

  removeChoice(id:string) {
    this.toolkit.removePort(this.getNode(), id)
  }

}
