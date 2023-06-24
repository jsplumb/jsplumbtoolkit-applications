import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core"
import {jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Base, Inspector, Edge, isNode, isPort } from "@jsplumbtoolkit/browser-ui"


import {
  VIEW, TABLE, COLUMN
} from "./constants"

import {datatypes, edgeMappings} from "./definitions"

/**
 * Inspector for the schema builder.  This component wraps the Toolkit's `Inspector` class, which is a render-agnostic manager
 * for a set of nodes/edges.
 *
 * In the ngAfterViewInit method we create an Inspector which renders itself into this component's native element. This
 * component declares a `currentType` member, which is used by the template to selectively render the appropriate UI
 * elements.
 *
 * The key here is that our template includes `jtk-att` attributes on the various input fields. Using these, the underlying
 * inspector is able to set/retrieve the current values.
 *
 * The `jtk-edge-type` component used in the edge inspector is a special case. It is a component that ships with the Toolkit
 * (from version 6.2.0 onwards) and which itself uses an underlying EdgeTypePicker to render a set of EdgePropertyMappings and
 * to allow the user to pick one. We have to tell the `edge-type-picker` about the set of edge mappings we want it to use,
 * and the inspector to interact with, as well as the name of the property that we're mapping. You could have multiple
 * `edge-type-picker` components in an inspector, with a different propertyName mapped to each one.
 */
@Component({
    template:`<div class="inspector">
        
        <div *ngIf="currentType === ''"></div>
        
        <div *ngIf="currentType === 'Edge'" class="jtk-inspector jtk-edge-inspector">
            <div>Label</div>
            <input type="text" jtk-att="label">
            <div>Line style</div>
            <jtk-edge-type [edgeMappings]="edgeMappings" propertyName="lineStyle" [inspector]="inspector"></jtk-edge-type>
            <div>Color</div>
            <input type="color" jtk-att="color">
        </div>
        
        <div *ngIf="currentType === TYPE_VIEW" class="jtk-inspector jtk-node-inspector">
          <div>Name</div>
          <input type="text" jtk-att="name" jtk-focus="true">
          <div>Query</div>
          <textarea jtk-att="query" rows="10"></textarea>
        </div>

        <div *ngIf="currentType === TYPE_TABLE" class="jtk-inspector jtk-node-inspector">
          <div>Name</div>
          <input type="text" jtk-att="name" jtk-focus="true"/>
        </div>

      <div *ngIf="currentType === TYPE_COLUMN" class="jtk-inspector jtk-node-inspector">
        <div>Name</div>
        <input type="text" jtk-att="name" jtk-focus/>
        <div>Datatype</div>
        <label *ngFor="let d of datatypes"><input type="radio" jtk-att="datatype" name="datatype" value="{{d.id}}"/>{{d.description}}</label>
      </div>
      
    </div>`,
    selector:"app-inspector"
})
export class InspectorComponent implements AfterViewInit {

    currentType:string = ''

    // @ts-ignore
    @Input() surfaceId:string

  // expose these on the class so the jtk-edge-type component can pick them up.
  edgeMappings = edgeMappings
  TYPE_VIEW = VIEW
  TYPE_TABLE = TABLE
  TYPE_COLUMN = COLUMN
  datatypes = datatypes

    // @ts-ignore
    inspector:Inspector

    constructor(private $jsplumb:jsPlumbService, private el:ElementRef, private changeDetector:ChangeDetectorRef) { }

    ngAfterViewInit(): void {

        this.$jsplumb.getSurface(this.surfaceId, (surface) => {
            this.inspector = new Inspector({
                container:this.el.nativeElement,
                surface,
                renderEmptyContainer:() => {
                    this.currentType = ''
                },
                refresh:(obj:Base, cb:() => void) => {
                    this.currentType = isNode(obj) ? obj.type : isPort(obj) ? "column" : "edge"
                    setTimeout(cb, 0)
                    this.changeDetector.detectChanges()
                }
            })
        })
    }



}
