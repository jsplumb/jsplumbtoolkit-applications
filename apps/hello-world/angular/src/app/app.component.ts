import {AfterViewInit, Component, ViewChild} from '@angular/core'
import {HelloComponent} from "./hello.component"
import {WorldComponent} from "./world.component"

import {AbsoluteLayout, AnchorLocations, ArrowOverlay, BlankEndpoint, DEFAULT, Vertex, Surface } from "@jsplumbtoolkit/browser-ui"
import {BrowserUIAngular, jsPlumbSurfaceComponent} from "@jsplumbtoolkit/browser-ui-angular"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent!:jsPlumbSurfaceComponent;

  toolkit!:BrowserUIAngular
  surface!:Surface

  view = {
    nodes:{
      clickable:{
        events:{
          tap:(p:{obj:Vertex}) => alert(`You clicked on node ${p.obj.id}`)
        }
      },
      hello:{
        parent:"clickable",
        component:HelloComponent
      },
      world:{
        parent:"clickable",
        component:WorldComponent
      }
    },
    edges:{
      // a default edge definition. Declares an arrow overlay at its tip and extracts 'label' from
      // edge data and displays it as a label overlay (by default at location 0.5)
      [DEFAULT]:{
        overlays:[
          {
            type:ArrowOverlay.type,
            options:{
              location: 1
            }
          }
        ],
        label:"{{label}}"
      }
    }
  }

  renderParams = {layout:{
      // there are several layouts that ship with the toolkit.
      type:AbsoluteLayout.type,
      options:{
        //... if your chosen layout is configurable, options go here
      }
    },
    // Allows us to specify edge color (and line width) in each edge's backing data
    simpleEdgeStyles:true,
    // Use a Continuous anchor and a blank endpoint by default.
    defaults:{
      anchor:AnchorLocations.Continuous,
      endpoint:BlankEndpoint.type
    }
  }

  ngAfterViewInit(): void {

    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit

    this.toolkit.load({
      data:{
        nodes:[
          { id:"1", type:"hello", label:"Hello", left:50, top:50 },
          { id:"2", type:"world", label:"World", left:350, top:50 }
        ],
        edges:[
          { source:"1", target:"2", data:{label:"a label", color:"purple"} }
        ]
      }
    })
  }


}
