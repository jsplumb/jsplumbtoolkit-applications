
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

/**
 * Superclass for table and view components. Offers an `editName` method.
 */
export class BaseEditableNodeComponent extends BaseNodeComponent {

  //
  // To edit a node's name we set it as the Toolkit's selection. Our inspector (see inspector.component.ts) listens
  // for changes to the selection and will display an inspector for this node, in which the user can edit the
  // node's properties.
  //
  editName():void {
    this.toolkit.setSelection(this.getNode())
  }
}
