import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core"
import {jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Base, Inspector, Edge} from "@jsplumbtoolkit/browser-ui"

@Component({
    template:`<div class="inspector">
        
        <div *ngIf="currentType === ''"></div>
        
        <div *ngIf="currentType === 'Edge'">
            <div class="jtk-inspector-section">
                <div>Label</div>
                <input type="text" jtk-att="label"/>
            </div>
            <div class="jtk-inspector-section">
                <div>Line style</div>
                <!--jtk-line-style current="{{lineStyle}}" jtk-att="lineStyle"></jtk-line-style-->
            </div>

            <div class="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="color"/>
            </div>
        </div>
        
        <div *ngIf="currentType === 'Node'" class="jtk-inspector jtk-node-inspector">
            <div class="jtk-inspector-section">
                <div>Text</div>
                <input type="text" jtk-att="text" jtk-focus/>
            </div>

            <div class="jtk-inspector-section">
                <div>Fill</div>
                <input type="color" jtk-att="fill"/>
            </div>

            <div class="jtk-inspector-section">
                <div>Color</div>
                <input type="color" jtk-att="textColor"/>
            </div>

            <div class="jtk-inspector-section">
                <div>Outline</div>
                <input type="color" jtk-att="outline"/>
            </div>
        </div>
    </div>`,
    selector:"app-inspector"
})
export class InspectorComponent implements AfterViewInit {

    currentType:string = 'foo'

    @Input() surfaceId:string

    constructor(private $jsplumb:jsPlumbService, private el:ElementRef, private changeDetector:ChangeDetectorRef) { }

    ngAfterViewInit(): void {

        this.$jsplumb.getSurface(this.surfaceId, (surface) => {
            new Inspector({
                container:this.el.nativeElement,
                surface,
                _renderEmptyContainer:() => {
                    this.currentType = ''
                },
                _refresh:(obj:Base, cb:() => void) => {
                    debugger
                    this.currentType = obj.objectType
                    setTimeout(cb, 0)
                    this.changeDetector.detectChanges()
                }
            })
        })
    }



}
