import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core"
import {jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Base, Inspector, isNode, isPort } from "@jsplumbtoolkit/browser-ui"

import {
  START, END,
  ACTION_CHOICE,
  ACTION_INPUT,
  ACTION_MESSAGE,
  ACTION_TEST,
  PROPERTY_MESSAGE,
  PROPERTY_LABEL, PROPERTY_PROMPT
} from "./constants"

@Component({
  template:`
    <div *ngIf="currentType === ''"></div>
    <div *ngIf='currentType === "${START}"'></div>
    <div *ngIf='currentType === "${END}"'></div>
    
    <div *ngIf='currentType === "${ACTION_MESSAGE}"' class="jtk-chatbot-inspector">
        <span>Message:</span>
        <input type="text" jtk-att="message" placeholder="message"/>
    </div>
    
    <div *ngIf='currentType === "${ACTION_INPUT}"' class="jtk-chatbot-inspector">
        <span>Message:</span>
        <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
        <span>Prompt:</span>
        <input type="text" jtk-att="${PROPERTY_PROMPT}" placeholder="prompt"/>
    </div>
    
    <div *ngIf='currentType === "${ACTION_CHOICE}"' class="jtk-chatbot-inspector">
        <span>Message:</span>
        <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
    </div>
    
    <div *ngIf='currentType === "${ACTION_TEST}"' class="jtk-chatbot-inspector">
        <span>Message:</span>
        <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
    </div>
    
    <div *ngIf='currentType === "${ACTION_TEST}"' class="jtk-chatbot-inspector">
        <span>Message:</span>
        <input type="text" jtk-att="${PROPERTY_MESSAGE}" placeholder="message"/>
    </div>
    
    <div *ngIf="currentType === CHOICE_PORT" class="jtk-chatbot-inspector">
        <span>Label:</span>
        <input type="text" jtk-att="${PROPERTY_LABEL}" jtk-focus placeholder="enter label..."/>
    </div>
    
    <div *ngIf="currentType === EDGE" class="jtk-chatbot-inspector">
        <div>Label</div>
        <input type="text" jtk-att="${PROPERTY_LABEL}"/>
    </div>
  `,
  selector:"app-inspector"
})
export class InspectorComponent implements AfterViewInit {

  currentType:string = ''

  @Input() surfaceId:string

  // @ts-ignore
  inspector:Inspector

  CHOICE_PORT = "choice-port"
  EDGE = "edge"

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
          this.currentType = isNode(obj) ? obj.type : isPort(obj) ? this.CHOICE_PORT : this.EDGE
          setTimeout(cb, 0)
          this.changeDetector.detectChanges()
        }
      })
    })
  }

}
