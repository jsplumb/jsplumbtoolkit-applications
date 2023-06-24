/**
 * Base datatype, defined for convenience.
 * @public
 */
import {LabelOverlay, ObjectData, PropertyMapping, EdgeDefinition} from "@jsplumbtoolkit/browser-ui"
import {
  CLASS_SCHEMA_RELATIONSHIP_CARDINALITY,
  DATATYPE_DATE,
  DATATYPE_INTEGER,
  DATATYPE_VARCHAR, N_TO_M, N_TO_M_NAME,
  ONE_TO_N,
  ONE_TO_N_NAME,
  ONE_TO_ONE,
  ONE_TO_ONE_NAME, PROPERTY_CARDINALITY
} from "./constants"

export const MESSAGE_DELETE_COLUMN = "message.column.delete"
export const MESSAGE_DELETE_TABLE = "message.table.delete"
export const MESSAGE_DELETE_VIEW = "message.view.delete"
export const MESSAGE_DELETE_RELATIONSHIP = "message.relationship.delete"
export const INSPECTOR_NODE_NAME = "inspector.node.name"
export const INSPECTOR_VIEW_QUERY = "inspector.view.query"
export const INSPECTOR_LINE_STYLE = "inspector.line.style"
export const INSPECTOR_PRIMARY_KEY = "inspector.primaryKey"
export const INSPECTOR_NOTHING_SELECTED = "inspector.nothing.selected"
export const INSPECTOR_CARDINALITY = "inspector.cardinality"
export const PROMPT_CLICK_TO_DELETE = "prompt.clickToDelete"
export const PROMPT_CLICK_TO_ADD_COLUMN = "prompt.clickToAddColumn"
export const PROMPT_CLICK_TO_EDIT_NAME = "prompt.clickToEditName"
export const MESSAGE_COLUMN_NAME_LENGTH = "message.columnNameLength"
export const MESSAGE_TABLE_NAME_LENGTH = "message.tableNameLength"
export const MESSAGE_MISSING_COLUMN_NAME = "message.missingColumnName"
export const MESSAGE_MISSING_TABLE_NAME = "message.missingTableName"
export const MESSAGE_MISSING_VIEW_NAME = "message.missingViewName"
export const MESSAGE_VIEW_NAME_LENGTH = "message.viewNameLength"
export const DEFAULT_COLUMN_NAME = "default.columnName"
export const DEFAULT_TABLE_NAME = "default.tableName"
export const DEFAULT_VIEW_NAME = "default.viewName"

/**
 * Default supported datatypes
 * @public
 */
export const datatypes:Array<Datatype> = [
  { id:DATATYPE_VARCHAR, description:"Character data"},
  { id:DATATYPE_INTEGER, description:"An integer"},
  { id:DATATYPE_DATE, description:"A date"}
]

/**
 * Default edge cardinalities.
 * @public
 */
export const cardinalities:Array<Cardinality> = [
  { id:ONE_TO_ONE, name:ONE_TO_ONE_NAME, labels:["1", "1"] },
  { id:ONE_TO_N, name:ONE_TO_N_NAME, labels:["1", "N"] },
  { id:N_TO_M, name:N_TO_M_NAME, labels:["N", "M"] }
]

//
// Create a set of edge mappings from the `cardinalities` array in definitions.ts. For each cardinality declared we
// add a mapping for the specific value, which has an overlay at each end showing the cardinality values.
// `cardinalityMappings` is passed to the render call, and the surface uses it to decide which overlays to show
// on a given edge.
export const cardinalityMappings:Record<string, EdgeDefinition> = {}
cardinalities.forEach(c => {
  cardinalityMappings[c.id] = {
    overlays:[
      { type:LabelOverlay.type, options:{ label:c.labels[0], location:0.1, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }},
      { type:LabelOverlay.type, options:{ label:c.labels[1], location:0.9, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }}
    ]
  }
})

export const edgeMappings = [
  {
    property:PROPERTY_CARDINALITY,
    mappings:cardinalityMappings
  }
]

/**
 * Options for connecting buttons to the undo/redo functionality of the component.
 * @public
 */
export interface UndoRedoOptions {
  /**
   * Optional element to which to attach a click listener and wire up to the undo mechanism of the Toolkit.
   * @public
   */
  undo?:HTMLElement

  /**
   * Optional element to which to attach a click listener and wire up to the redo mechanism of the Toolkit.
   * @public
   */
  redo?:HTMLElement
}

/**
 * Set of messages required by the Schema Builder component.
 * @public
 */
export interface SchemaBuilderMessages extends Record<string, any> {
  [MESSAGE_MISSING_TABLE_NAME]:string
  [MESSAGE_TABLE_NAME_LENGTH]:string
  [MESSAGE_COLUMN_NAME_LENGTH]:string
  [MESSAGE_VIEW_NAME_LENGTH]:string
  [MESSAGE_MISSING_COLUMN_NAME]:string
  [MESSAGE_MISSING_VIEW_NAME]:string
  [MESSAGE_DELETE_COLUMN]:string
  [MESSAGE_DELETE_TABLE]:string
  [MESSAGE_DELETE_VIEW]:string
  [INSPECTOR_PRIMARY_KEY]:string
  [INSPECTOR_NODE_NAME]:string
  [INSPECTOR_VIEW_QUERY]:string
  [INSPECTOR_CARDINALITY]:string
  [MESSAGE_DELETE_RELATIONSHIP]:string,
  [DEFAULT_COLUMN_NAME]:string,
  [DEFAULT_TABLE_NAME]:string,
  [DEFAULT_VIEW_NAME]:string,
}


/**
 * Config object for an object palette.
 * @public
 */
export interface PaletteConfiguration {
  /**
   * Container to write the palette into. Required.
   */
  container: HTMLElement
}

/**
 * Config object for an object inspector
 * @public
 */
export interface InspectorConfiguration {
  /**
   * Container to write the inspector into. Required.
   */
  container:HTMLElement
  /**
   * Defaults to true, meaning on text field blur and on changes to drop down selections, the dataset is immediately updated.
   */
  autoCommit?:boolean
  /**
   * Defaults to false. If true, a 'commit' button is drawn on the inspector. If you set `autoCommit:false` then `commitButton` will
   * be forced to true.
   */
  commitButton?:boolean
  /**
   * Defaults to false. If true, a 'cancel' button is drawn on the inspector, which, when clicked, will cause the inspector to be closed. Unline
   * `commitButton`, this value will not be forced to `true` if `autoCommit` is `false`.
   */
  cancelButton?:boolean
}

/**
 * Options for the schema builder.
 * @public
 */
export interface SchemaBuilderOptions {
  /**
   * Handler for error messages shown to the user.
   * @param msg
   */
  onError?:(msg:string)=>any

  /**
   * Handler for questions asked of the user (simple yes/no questions). If not supplied, this will use the browser's
   * default 'confirm' prompt.
   * @param msg
   * @param continueCallback
   */
  prompt?:(msg:string, continueCallback:() => any) => any

  /**
   * Optional set of messages to use. The default messages are in English. You can use this to override
   * the English defaults, or to supply messages in a different language.
   */
  messages?:SchemaBuilderMessages

  /**
   * The element into which to draw the schema builder
   */
  container:Element

  /**
   * Optional config for palette to drag new elements into the builder.
   */
  palette?:PaletteConfiguration

  /**
   * Optional list of edge cardinalities to either add to the defaults, or to replace the defaults (see `omitDefaultCardinalties`)
   */
  cardinalities?: Array<Cardinality>

  /**
   * Defaults to false. If true, only the `cardinalities` you supply will be used by the component.
   */
  omitDefaultCardinalities?: boolean

  /**
   * Optional list of datatypes to either add to the defaults, or to replace the default datatypes.
   */
  datatypes?:Array<Datatype>

  /**
   * Defaults to false. If true, only the `datatypes` you supply will be used.
   */
  omitDefaultDatatypes?:boolean

  /**
   * Minimum length of the name of a table. Defaults to 3 characters.
   */
  minTableNameLength?: number

  /**
   * Minimum length of the name of a view. Defaults to 3 characters.
   */
  minViewNameLength?: number

  /**
   * Minimum length of the name of a column. Defaults to 3 characters.
   */
  minColumnNameLength?: number

  /**
   * Whether or not the component should be read only. Defaults to false.
   */
  readOnly?:boolean

  /**
   * Optional object inspector setup. If you do not provide this, no inspector will be registered.
   */
  inspector?:InspectorConfiguration

  /**
   * Options for wiring up undo/redo buttons to the component.
   */
  undoRedo?:UndoRedoOptions
}

/**
 * Dataset for the schema builder. This defines the format of the data you can pass to `loadData`, or which is expected to be
 * returned by an endpoint called by `loadUrl`. It is also the format of the data that is output by the `exportData()` method
 * of the schema builder.
 * @public
 */
export interface SchemaBuilderData {
  name: string;
  nodes: Array<SchemaVertexData>;
  edges: Array<RelationshipData>;
}

/**
 * The base type for the various data types in the schema builder's data model.
 * @public
 */
export interface SchemaModelData extends ObjectData {
  id: string;
}

/**
 * Backing data for a vertex in the schema. This is the parent interface
 * of the TableData and ViewData node types, and this is what you should
 * extend if you create a new node type.
 * @public
 */
export interface SchemaVertexData extends SchemaModelData {}

/**
 * Backing data for a Table
 * @public
 */
export interface TableData extends SchemaVertexData {
  name: string;
  columns: Array<ColumnData>;
}

/**
 * Backing data for a View
 * @public
 */
export interface ViewData extends SchemaVertexData {
  name: string;
  query: string;
}

/**
 * Base interface for objects in the schema
 */
export interface SchemaModelObject<T extends SchemaModelData> {
  id: string;
  data: T;
}

/**
 * A vertex in the schema builder.
 * @public
 */
export interface SchemaVertex<T extends SchemaModelData> extends SchemaModelObject<T> { }

/**
 * A table vertex.
 * @public
 */
export interface Table extends SchemaVertex<TableData> {}

/**
 * A view vertex.
 * @public
 */
export interface View extends SchemaVertex<ViewData> {}

/**
 * The backing data for a column in a table.
 * @public
 */
export interface ColumnData extends SchemaModelData {
  name: string;
  datatype: string;
  primaryKey: boolean;
}

/**
 * Models a column on a table.
 * @public
 */
export interface Column extends SchemaModelObject<ColumnData> {
  getParent(): Table;
}

/**
 * The backing data for a relationship in the schema.
 * @public
 */
export interface RelationshipData extends SchemaModelData {
  cardinality: string;
}

/**
 * Models the relationship between two columns.
 * @public
 */
export interface Relationship extends SchemaModelObject<RelationshipData> {}

/**
 * Defines the cardinality of some relationship in the schema. If you want to supply your own set of cardinalities, for
 * each one you supply you need to provide an id and a name, as well as the labels to put at each end of the edge in the UI.
 * @public
 */
export declare type Cardinality = {
  /**
   * internal id for the cardinality (will be used in the dataset)
   */
  id: string;
  /**
   * Name displayed to the user throughout the UI for this cardinality
   */
  name: string;
  /**
   * Labels to display at each end of an edge that has this cardinality.
   */
  labels: [string, string];
}

/**
 * Defines a supported datatype for columns.
 */
export declare type Datatype = {
  /**
   * id for the datatype
   */
  id: string;
  /**
   * Datatype's description
   */
  description:string;
}

/**
 * An item for the schema palette.
 * @public
 */
export declare type SchemaPaletteItem = {
  id:string;
  label:string;
}

/**
 * The SchemaBuilder component.
 * @public
 */
export interface SchemaBuilder {

  /**
   * Adds a table to the dataset with the given data.
   * @param data Data for the table. This should include, at a minimum, an id, and a type of "table".
   * @public
   */
  addTable(data:TableData):Table

  /**
   * Adds a column with the given details to the table with the given id.
   * @param tableId
   * @param data
   * @public
   */
  addColumn(tableId:string, data:ColumnData):void;

  /**
   * Add a new view with the given details to the dataset.
   * @public
   * @param data
   */
  addView(data:ViewData):View;

  /**
   * Loads a schema from the specified url. The response from the URL is expected to be JSON, in `SchemaBuilderData` format.
   * @public
   * @param url
   * @param onload Optional function to call after the data has loaded.
   */
  loadUrl(url:string, onload?:Function):void;

  /**
   * Loads the given schema, first clearing the dataset.
   * @public
   * @param data
   * @param onload Optional function to call after the data has loaded.
   */
  loadData(data:SchemaBuilderData, onload?:Function):void;

  /**
   * Clears the current schema dataset.
   * @public
   */
  clear():void;

  /**
   * Exports the current schema dataset.
   * @public
   */
  exportData():SchemaBuilderData;

  /**
   * Performs an undo of the last action.
   * @public
   */
  undo():void;

  /**
   * Performs a redo of the last undone action (if any).
   * @public
   */
  redo():void;

  /**
   * Delete the specified column from the table on which it resides.
   * @public
   * @param column
   */
  deleteColumn(column:Column):void;

  /**
   * Edits the given relationship in the associated inspector, if one is configured.
   * @param edge
   */
  editRelationship(edge:Relationship):void;

  /**
   * Edits the given column in the associated inspector, if one is configured.
   * @param column
   */
  editColumn(column:Column):void;

  /**
   * Get the table with the given id.
   * @public
   * @param tableId
   */
  getTable(tableId:string):Table|null;

  /**
   * Get the view with the given id.
   * @public
   * @param viewId
   */
  getView(viewId:string):View|null;

  /**
   * Remove the given table
   * @public
   * @param table Table object, or its id.
   */
  removeTable(table:string|Table):void;

  /**
   * Remove the given view
   * @public
   * @param view View object, or its id.
   */
  removeView(view:string|View):void;

  /**
   * Zoom the display so all content fits in the viewport.
   * @public
   */
  zoomToFit():void;

  /**
   * Zoom the display so all content fits in the viewport, but don't adjust the zoom if all the content is already visible.
   * @public
   */
  zoomToFitIfNecessary():void;

  /**
   * Changes a table name.
   * @param table - ID of a table to rename, or the Table object.
   * @param name - Name to set. If provided, the user is not prompted to enter a new name.
   * @public
   */
  renameTable(table:string|Table, name:string):void;

  /**
   * Renames a view.
   * @param view ID of the view to rename, or a View object.
   * @param name - Name to use. If null, the user will be prompted for the new name.
   * @public
   */
  renameView(view:string|View, name:string):void;

  // /**
  //  * Pops up the dialog allowing the user to edit the contents of a view.
  //  * @param view
  //  */
  // editViewQuery(view:string|View):void;
  //
  // /**
  //  * Pops up the dialog allowing the user to edit the details of some column.
  //  * @param column
  //  */
  // editColumnDetails(column:Column):void;

  editView(view:string|View):void


}

/**
 * Vanilla implementation of schema builder. Offers methods to attach an inspector
 * and/or palette manually, but for most usage scenarios it will suffice to provide this
 * information in the flowchart builder's options. This interface mostly exists to assist
 * the various library wrappers.
 */
export interface SchemaBuilderBase extends SchemaBuilder {
  /**
   * Attaches a palette that is using the given config. This is for internal use.
   * @param config
   * @internal
   */
  attachPalette(config:PaletteConfiguration):void;

  /**
   * Attaches an inspector that is using the given config. This is for internal use.
   * @param config
   * @internal
   */
  attachInspector(config:InspectorConfiguration):void;
}

/**
 * Create a new instance of the SchemaBuilder.
 * @param options
 * @public
 */
export declare function newInstance(options:SchemaBuilderOptions):SchemaBuilderBase;

/**
 * A helper method to generate a UUID v4.
 */
export declare function uuid():string;
