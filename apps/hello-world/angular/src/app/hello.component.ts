import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Component} from "@angular/core"

@Component({
  template:`<div class="hello-node">{{obj['label']}}</div>`
})
export class HelloComponent extends BaseNodeComponent {

}
