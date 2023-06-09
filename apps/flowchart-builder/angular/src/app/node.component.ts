import {Component} from "@angular/core"
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
    template:`<div style="width:{{obj.width}}px;height:{{obj.height}}px;color:{{obj.textColor}}" class="flowchart-object" data-jtk-target="true" data-jtk-target-port-type="target">
        <span>{{obj.text}}</span>
        <jtk-shape [obj]="obj" [width]="obj.width" [height]="obj.height"></jtk-shape>
        <div class="jtk-connect jtk-connect-left" data-jtk-anchor-x="0" data-jtk-anchor-y="0.5" data-jtk-orientation-x="-1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source"></div>
        <div class="jtk-connect jtk-connect-right" data-jtk-anchor-x="1" data-jtk-anchor-y="0.5" data-jtk-orientation-x="1"  data-jtk-orientation-y="0" data-jtk-source="true" data-jtk-port-type="source"></div>
        <div class="jtk-connect jtk-connect-top" data-jtk-anchor-x="0.5" data-jtk-anchor-y="0" data-jtk-orientation-x="0"  data-jtk-orientation-y="-1" data-jtk-source="true" data-jtk-port-type="source"></div>
        <div class="jtk-connect jtk-connect-bottom" data-jtk-anchor-x="0.5" data-jtk-anchor-y="1" data-jtk-orientation-x="0"  data-jtk-orientation-y="1" data-jtk-source="true" data-jtk-port-type="source"></div>
        <div class="node-delete node-action delete" (click)="this.removeNode()"></div>
    </div>`
})
export class NodeComponent extends BaseNodeComponent { }
