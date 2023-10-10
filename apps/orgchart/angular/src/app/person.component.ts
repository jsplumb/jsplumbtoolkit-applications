import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Component} from "@angular/core"

@Component({
  template:`
    <div>
      <img [src]="getImage()" [alt]="obj['name']">
      <div>
        <strong>{{obj['name']}}</strong>
        <span>{{obj['title']}}</span>
      </div>
    </div>  
  `
})
export class PersonComponent extends BaseNodeComponent {

  getImage() {
    return `/assets/avatars/${this.obj['img']}`
  }

}
