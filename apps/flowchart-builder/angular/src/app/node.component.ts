import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

import { anchorPositions } from "./app.component"

@Component({
    template:`<div style="width:{{obj.width}}px;height:{{obj.height}}px;color:{{obj.textColor}}" class="flowchart-object" data-jtk-target="true" data-jtk-target-port-type="target">
        <span>{{obj.text}}</span>
        <jtk-shape [obj]="obj" [width]="obj.width" [height]="obj.height"></jtk-shape>

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
