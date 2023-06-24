import {AfterViewInit, Component, ViewChild} from '@angular/core'
import {BrowserUIAngular, jsPlumbService, jsPlumbSurfaceComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {AnchorLocations, consume, DEFAULT,
  DotEndpoint,
  Edge,
  EVENT_CANVAS_CLICK, EVENT_CLICK, EVENT_TAP, ForceDirectedLayout, LabelOverlay,
  LassoPlugin,
  StateMachineConnector, Surface, SelectionModes, Vertex, isPort } from "@jsplumbtoolkit/browser-ui"
import {TableNodeComponent} from "./table.node.component"
import {ViewNodeComponent} from "./view.node.component"
import {ColumnComponent} from "./column.component"
import {COMMON} from "./constants"
import {cardinalities, edgeMappings, Relationship} from "./definitions"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  // @ts-ignore
  toolkit:BrowserUIAngular
  // @ts-ignore
  surface:Surface

  constructor(public $jsplumb:jsPlumbService) {
  }

  ngAfterViewInit() {

    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit

    this.toolkit.load({
      url:'/assets/schema-1.json'
    })
  }

  dataGenerator = (el:Element) => {
    const type = el.getAttribute("data-type")
    return {
      type,
      name:type,
      w: 120,
      h: 80
    }
  }

  view = {
    nodes:{
      table:{
        component:TableNodeComponent
      },
      view:{
        component:ViewNodeComponent
      }
    },
    ports: {
      [DEFAULT]: {
        component: ColumnComponent,
        edgeType: COMMON, // the type of edge for connections from this port type
        maxConnections: -1 // no limit on connections
      }
    },
    edges:{
      [DEFAULT]: {
        detachable: false,
        anchor: [AnchorLocations.Left, AnchorLocations.Right],
        connector: StateMachineConnector.type,
        cssClass: "jtk-schema-common-edge",
        events: {
          [EVENT_CLICK]: (params: { edge: Edge, e:Event }) => {
            // defaultPrevented is true when this was a delete edge click.
            if (!params.e.defaultPrevented) {
              this.toolkit.setSelection(params.edge)
            }
          }
        },
        overlays: [
          {
            type: LabelOverlay.type,
            options: {
              cssClass: "jtk-schema-delete-relationship",
              label: "x",
              events: {
                [EVENT_TAP]: (params: { edge: Relationship, e:Event }) => {
                  consume(params.e)
                  this.toolkit.removeEdge(params.edge.id)
                }
              }
            }
          }
        ]
      }
    }
  }

  renderParams = {
    dragOptions: {
      filter:[
        "jtk-delete-button", "jtk-add-button", "jtk-schema-add"
      ].join(",")
    },
    plugins:[
      LassoPlugin.type
    ],
    propertyMappings:{
      edgeMappings
    },
    events: {
      [EVENT_CANVAS_CLICK]: (e:Event) => {
        this.toolkit.clearSelection()
      }
    },
    zoomToFit:true,
    layout:{
      type: ForceDirectedLayout.type,
      options: {
        padding: {x:150, y:150}
      }
    },
    defaults:{
      endpoint:{
        type:DotEndpoint.type,
        options:{
          cssClass:".jtk-schema-endpoint"
        }
      }
    },
    consumeRightClick:false
  }

  toolkitParams = {
    //
    // instructs the toolkit to only allow one type of object to be selected at any time - a node, or a port, or an edge.
    // the inspector relies on this being set.
    //
    selectionMode:SelectionModes.isolated,
    //
    // instructs the Toolkit to look for port data inside the `columns` array of each node's backing data.
    //
    portDataProperty: "columns",
    //
    // set `cardinality` to be the first entry in the list by default.
    //
    beforeStartConnect:(source: Vertex, type: string) => {
      return {
        cardinality:cardinalities[0].id
      }
    },
    //
    // Prevent connections from a column to itself or to another column on the same table.
    //
    beforeConnect:(source:Vertex, target:Vertex) => {
      return isPort(source) && isPort(target) && source !== target && source.getParent() !== target.getParent()
    }
  }
}
