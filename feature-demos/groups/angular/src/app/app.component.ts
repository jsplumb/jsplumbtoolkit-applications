import {AfterViewInit, Component, ViewChild} from '@angular/core'
import {NodeComponent} from "./node.component"

import { DEFAULT, Node, Group,
  EVENT_TAP, Surface, AbsoluteLayout,
  BlankEndpoint, EVENT_CLICK,
  AnchorLocations,
LassoPlugin, EVENT_CANVAS_CLICK,
StateMachineConnector, ArrowOverlay, ForceDirectedLayout
} from "@jsplumbtoolkit/browser-ui"

import {BrowserUIAngular, jsPlumbSurfaceComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {GroupComponent} from "./group.component"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent!:jsPlumbSurfaceComponent;

  toolkit!:BrowserUIAngular
  surface!:Surface

  data = {
    "groups":[
      {"id":"one", "title":"Group 1", "left":100, top:50 },
      {"id":"two", "title":"Group 2", "left":750, top:250, type:"constrained"  },
      {"id":"three", "title":"Nested Group", "left":50, "top":50, "group":"two"  }
    ],
    "nodes": [
      { "id": "window1", "name": "1", "left": 10, "top": 20, group:"one" },
      { "id": "window2", "name": "2", "left": 140, "top": 50, group:"one" },
      { "id": "window3", "name": "3", "left": 450, "top": 50 },
      { "id": "window4", "name": "4", "left": 110, "top": 370 },
      { "id": "window5", "name": "5", "left": 140, "top": 150, group:"one" },
      { "id": "window6", "name": "6", "left": 450, "top": 50, group:"two" },
      { "id": "window7", "name": "7", "left": 50, "top": 450 }
    ],
    "edges": [
      { source:"window3", target:"one"},
      { source:"window3", target:"window4"},
      { source:"one", target:"two"},
      { source:"window5", target:"window6"},
      { source:"window1", target:"window2"},
      { source:"window1", target:"window5"}
    ]
  }

  toolkitParams = {
    groupFactory:(type:string, data:Record<string, any>, callback:Function) => {
      data['title'] = "Group " + (this.toolkit.getGroupCount() + 1)
      callback(data)
      return true
    },
    nodeFactory:(type:string, data:Record<string, any>, callback:Function) => {
      data['name'] = (this.toolkit.getNodeCount() + 1)
      callback(data)
      return true
    }
  }

  view = {
    nodes: {
      [DEFAULT]: {
        component:NodeComponent,
        events: {
          [EVENT_TAP]: (params:{node:Node}) => {
            this.toolkit.toggleSelection(params.node);
          }
        }
      }
    },
    groups:{
      [DEFAULT]:{
        component:GroupComponent,
        endpoint:BlankEndpoint.type,
        anchor:AnchorLocations.Continuous,
        revert:false,
        orphan:true,
        constrain:false,
        autoSize:true,
        layout:{
          type:AbsoluteLayout.type
        },
        events:{
          [EVENT_CLICK]:function(){
            console.log(arguments)
          }
        }
      },
      constrained:{
        parent:DEFAULT,
        constrain:true
      }
    },
    edges:{
      [DEFAULT]:{
        events:{
          [EVENT_CLICK]:function() {
            console.log(arguments)
          }
        }
      }
    }
  }

  renderParams ={
    layout: {
      type: ForceDirectedLayout.type,
      options: {
        absoluteBacked: true
      }
    },
    // FOR people coming from 2.x versions of the Toolkit, this key used to be `jsPlumb`.
    defaults: {
      anchor:AnchorLocations.Continuous,
      endpoint: BlankEndpoint.type,
      connector: { type:StateMachineConnector.type, options:{ cssClass: "connectorClass", hoverClass: "connectorHoverClass" } },
      paintStyle: { strokeWidth: 1, stroke: '#89bcde' },
      hoverPaintStyle: { stroke: "orange" },
      connectionOverlays: [
        { type:ArrowOverlay.type, options:{ fill: "#09098e", width: 10, length: 10, location: 1 } }
      ]
    },
    plugins:[
      LassoPlugin.type
    ],
    dragOptions: {
      filter: ".delete *, .group-connect *, .delete"
    },
    magnetize:{
      afterDrag:true,
      afterGroupExpand:true
    },
    events: {
      [EVENT_CANVAS_CLICK]: (e:MouseEvent) => {
        this.toolkit.clearSelection()
      }
    },
    consumeRightClick:false,
    zoomToFit:true
  }

  dataGenerator(e:Element){
      return {
        type:"default"
      }
  }

  ngAfterViewInit(): void {
    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit

    this.toolkit.load({data:this.data})
  }


}
