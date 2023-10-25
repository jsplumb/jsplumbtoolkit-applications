import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Component} from "@angular/core"

@Component({
  template:`<div class="world-node">{{obj['label']}}</div>`
})
export class WorldComponent extends BaseNodeComponent {

}
