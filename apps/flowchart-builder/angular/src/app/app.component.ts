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
  EVENT_CLICK,
  FLOWCHART_SHAPES,
  initializeOrthogonalConnectorEditors,
  ObjectAnchorSpec,
    SelectionModes
} from "@jsplumbtoolkit/browser-ui"

import edgeMappings from './edge-mappings'

import {
  CLASS_EDGE_LABEL,
  CLASS_FLOWCHART_EDGE,
  DEFAULT_FILL,
  DEFAULT_STROKE, DEFAULT_TEXT_COLOR,
  GRID_BACKGROUND_OPTIONS,
  GRID_SIZE, DEFAULT_OUTLINE_WIDTH, EDGE_TYPE_TARGET_ARROW, PROPERTY_LINE_STYLE, PROPERTY_COLOR, PROPERTY_LABEL
} from "./constants"

import {NodeComponent} from "./node.component"

export const anchorPositions:Array<ObjectAnchorSpec & {id:string}> = [
  {x:0, y:0.5, ox:-1, oy:0, id:"left" },
  {x:1, y:0.5, ox:1, oy:0, id:"right" },
  {x:0.5, y:0, ox:0, oy:-1, id:"top" },
  {x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

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
    this.toolkit = this.surfaceComponent.toolkit
    this.edgeEditor = new EdgePathEditor(this.surface, { activeMode:true})

    this.toolkit.load({
      url:'/assets/copyright.json'
    })
  }

  /**
   * Generator for data for nodes dragged from palette.
   * @param el
   */
  dataGenerator = (el:Element) => {
    return {
      fill:DEFAULT_FILL,
      outline:DEFAULT_STROKE,
      textColor:DEFAULT_TEXT_COLOR,
      outlineWidth:DEFAULT_OUTLINE_WIDTH
    }
  }

  toolkitParams = {
    // set the Toolkit's selection mode to 'isolated', meaning it can select a set of edges, or a set of nodes, but it
    // cannot select a set of nodes and edges. In this demonstration we use an inspector that responds to events from the
    // toolkit's selection, so setting this to `isolated` helps us ensure we dont try to inspect edges and nodes at the same
    // time.
    selectionMode:SelectionModes.isolated,
    // This is the payload to set when a user begins to drag an edge - we return values for the
    // edge's label, color and line style. If you wanted to implement a mechanism whereby you have
    // some "current style" you could update this method to return some dynamically configured
    // values.
    beforeStartConnect:(node, edgeType) => {
      return {
        [PROPERTY_LABEL]:"",
        [PROPERTY_COLOR]:DEFAULT_STROKE,
        [PROPERTY_LINE_STYLE]:EDGE_TYPE_TARGET_ARROW
      }
    }
  }

  view = {
    nodes: {
      [DEFAULT]:{
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
          [EVENT_CLICK]:(p) => {
            this.toolkit.setSelection(p.edge)
            this.edgeEditor.startEditing(p.edge, {
              deleteButton:true,
              anchorPositions
            })
          }
        }
      }
    },
    ports: {
      target: {
        anchorPositions,
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
