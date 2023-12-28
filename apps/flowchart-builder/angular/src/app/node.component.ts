import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

import { anchorPositions } from "./app.component"

@Component({
    template:`<div style="color:{{obj.textColor}}" class="flowchart-object" data-jtk-target="true">
        
        <jtk-shape [obj]="obj" showLabels="true" labelProperty="text" [width]="obj.width" [height]="obj.height"></jtk-shape>

        <div *ngFor="let anchor of anchorPositions" 
             class="jtk-connect jtk-connect-{{anchor.id}}" 
             [attr.data-jtk-anchor-x]="anchor.x" 
             [attr.data-jtk-anchor-y]="anchor.y" 
             [attr.data-jtk-orientation-x]="anchor.ox" 
             [attr.data-jtk-orientation-y]="anchor.oy" 
             data-jtk-source="true"></div>
        
        <div class="node-delete node-action delete" (click)="this.removeNode()"></div>
    </div>`
})
export class NodeComponent extends BaseNodeComponent {
    anchorPositions = anchorPositions
}
