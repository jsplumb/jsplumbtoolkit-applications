import {AfterViewInit, Component, ViewChild} from '@angular/core'

import {
  AngularRenderOptions,
  jsPlumbService,
  jsPlumbSurfaceComponent,
  BrowserUIAngular
} from "@jsplumbtoolkit/browser-ui-angular"


import {
  LassoPlugin,
  DrawingToolsPlugin,
  AbsoluteLayout,
  BackgroundPlugin,
  EVENT_TAP,
  EdgePathEditor,
  Surface,
  DEFAULT,
  BlankEndpoint,
  OrthogonalConnector,
  EVENT_CANVAS_CLICK,
  Vertex,
  findClosestPoint,
  PointXY,
  ArrayAnchorSpec,
  AnchorOrientationHint,
  FLOWCHART_SHAPES,
  initializeOrthogonalConnectorEditors
} from "@jsplumbtoolkit/browser-ui"

import edgeMappings from './edge-mappings'

import {
  CLASS_EDGE_LABEL,
  CLASS_FLOWCHART_EDGE,
  DEFAULT_FILL,
  DEFAULT_STROKE, DEFAULT_TEXT_COLOR,
  GRID_BACKGROUND_OPTIONS,
  GRID_SIZE
} from "./constants"

import {NodeComponent} from "./node.component"

function _$_anchorPositionFinder (el:Element, elxy:PointXY):ArrayAnchorSpec {
  const point = findClosestPoint(elxy, {w:1, h:1}, [
    {x:0, y:0.5, ox:-1, oy:0},
    {x:1, y:0.5, ox:1, oy:0},
    {x:0.5, y:0, ox:0, oy:-1},
    {x:0.5, y:1, ox:0, oy:1}
  ])
  const p = point.p
  return [ p.x, p.y, p.ox as AnchorOrientationHint, p.oy as AnchorOrientationHint ]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  title = 'angular';

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:BrowserUIAngular
  surface:Surface
  edgeEditor:EdgePathEditor

  constructor(public $jsplumb:jsPlumbService) {
    this.$jsplumb.registerShapeLibrary([FLOWCHART_SHAPES])
  }

  ngAfterViewInit() {

    initializeOrthogonalConnectorEditors()

    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit as any
    this.edgeEditor = new EdgePathEditor(this.surface, { activeMode:true})

    this.toolkit.load({
      url:'/assets/copyright.json'
    })

    ;(window as any).tk = this.toolkit
  }

  /**
   * Generator for data for nodes dragged from palette.
   * @param el
   */
  dataGenerator = (el:Element) => {
    return {
      fill:DEFAULT_FILL,
      outline:DEFAULT_STROKE,
      textColor:DEFAULT_TEXT_COLOR
    }
  }

  view = {
    nodes: {
      default:{
        component:NodeComponent,
        events: {
          [EVENT_TAP]: (params) => {
            this.edgeEditor.stopEditing()
            // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
            if (this.toolkit.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
              this.toolkit.setSelection(params.obj)
            } else {
              // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
              this.toolkit.addToSelection(params.obj)
            }
          }
        }
      }
    },
    edges: {
      [DEFAULT]: {
        endpoint:BlankEndpoint.type,
        connector: {
          type:OrthogonalConnector.type,
          options:{
            cornerRadius: 3,
            alwaysRespectStubs:true
          }
        },
        cssClass:CLASS_FLOWCHART_EDGE,
        labelClass:CLASS_EDGE_LABEL,
        label:"{{label}}",
        outlineWidth:10,
        events: {
          click:(p) => {
            this.toolkit.setSelection(p.edge)
            this.edgeEditor.startEditing(p.edge, {
              deleteButton:true,
              anchorPositionFinder: (el:Element, elxy:PointXY, vertex:Vertex) => {
                return _$_anchorPositionFinder(el, elxy)
              }
            })
          }
        }
      }
    },
    ports: {
      source: {
        maxConnections: -1
      },
      target: {
        anchorPositionFinder:(el, elxy) => {
          return _$_anchorPositionFinder(el, elxy)
        },
        maxConnections: -1,
        isTarget: true
      }
    }
  }

  renderParams:AngularRenderOptions = {
    // see `edge-mappings.js` for details.
    propertyMappings:{
      edgeMappings:edgeMappings()
    },
    // Layout the nodes using an absolute layout
    layout: {
      type: AbsoluteLayout.type
    },
    grid:{
      size:GRID_SIZE
    },
    events: {
      [EVENT_CANVAS_CLICK]: (e) => {
        this.toolkit.clearSelection()
        this.edgeEditor.stopEditing()
      }
    },
    consumeRightClick: false,
    dragOptions: {
      filter: ".jtk-draw-handle, .node-action, .node-action i"
    },
    plugins:[
      {
        type:DrawingToolsPlugin.type,
        options:{
          widthAttribute:"width",
          heightAttribute:"height"
        }
      },
      {
        type:LassoPlugin.type,
        options: {
          lassoInvert:true,
          lassoEdges:true
        }
      },
      {
        type:BackgroundPlugin.type,
        options:GRID_BACKGROUND_OPTIONS
      }
    ],
    zoomToFit:true
  }



}