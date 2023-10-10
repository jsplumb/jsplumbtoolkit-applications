import {Component, EventEmitter, Input, Output} from "@angular/core"
import {Vertex} from "@jsplumbtoolkit/browser-ui"

@Component({
    template:`<a class="jtk-orgchart-inspector-person" href="#" [attr.data-id]="person.data['id']" (click)="selectPerson(person)">
        <img [src]="getImage(person)" [alt]="person.data['name']"/>
        <div>
            {{person.data['name']}}
            <span>{{person.data['title']}}</span>
        </div>
        
    </a>
        
    `,
    selector:"app-inspector-person"
})
export class InspectorPersonComponent {
    @Input() person!:Vertex

    @Output() personSelected:EventEmitter<Vertex> = new EventEmitter()

    selectPerson(person:Vertex) {
        this.personSelected.emit(person)
    }

    getImage(person:Vertex) {
        return `/assets/avatars/${person.data['img']}`
    }
}
