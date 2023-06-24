
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

export class BaseEditableNodeComponent extends BaseNodeComponent {

  editName():void {
    this.toolkit.setSelection(this.getNode())
  }
}
