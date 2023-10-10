import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core"

import { Node, Base, Inspector, Vertex, Edge, JsPlumbToolkit, Surface } from "@jsplumbtoolkit/browser-ui"
import {jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  template:`

    <div class="jtk-orgchart-inspector" *ngIf="current != null">
      <h1>{{current.data['name']}}</h1>
      <h2>{{current.data['title']}}</h2>
      <h5 *ngIf="reports.length > 0">Reports:</h5>
      <app-inspector-person *ngFor="let r of reports" [person]="r" (personSelected)="selectPerson($event)"></app-inspector-person>
      <h5 *ngIf="manager != null">Reports to:</h5>
      <app-inspector-person *ngIf="manager != null" [person]="manager" (personSelected)="selectPerson($event)"></app-inspector-person>
    </div>
    
  `,
  selector:"app-inspector"
})
export class InspectorComponent implements AfterViewInit {

  current!:Node|null
  reports:Array<Vertex> = []
  manager!:Node|null

  @Input() surfaceId!:string

  @Output() personSelected:EventEmitter<Vertex> = new EventEmitter<Vertex>()

  inspector!:Inspector

  retrieveDirectReports(person:Node){
    this.reports = person.getSourceEdges().map(e => e.target)
  }

  getManager(person:Node) {
    this.manager = person.getTargetEdges().map((e:Edge) => e.source)[0] as Node
  }

  selectPerson(person:Vertex) {
    this.personSelected.emit(person)
  }

  constructor(private $jsplumb:jsPlumbService, private el:ElementRef, private changeDetector:ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.$jsplumb.getSurface(this.surfaceId, (surface) => {
      this.inspector = new Inspector({
        container:this.el.nativeElement,
        surface,
        renderEmptyContainer:() => {
          this.current = null
          this.manager = null
          this.reports.length = 0
        },
        refresh:(obj:Base, cb:() => void) => {
          this.current = obj as Node
          this.retrieveDirectReports(this.current)
          this.getManager(this.current)
          setTimeout(cb, 0)
          this.changeDetector.detectChanges()
        }
      })
    })
  }

}
