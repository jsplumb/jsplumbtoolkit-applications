# Flowchart Builder (React)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**This is a work in progress**

## Overview

This is a version of the [Flowchart Builder starter app](https://jsplumbtoolkit.com/demonstrations/flowchart-builder) written using the Toolkit's React integration.  Users can drag/resize/edit nodes, change the paths of a given edge, and edit node/edge labels. A lot of the code from the vanilla app is reused in this application, but it's just reorganised to work as a React app.

## Setup

You can use the `npm run install` or `npm run install:react` tasks from the project root to install dependencies for every app or just for React apps, or you can run `npm i` in this folder to just install the dependencies for this application.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## App structure

The entry point for this app is `App.js`, which does very little except render a `FlowchartComponent`. The flowchart component is where the meat of the application resides.

The flowchart component code is roughly broken into 5 discrete sections:

### Anchor positions

```javascript
export const anchorPositions = [
    {x:0, y:0.5, ox:-1, oy:0, id:"left" },
    {x:1, y:0.5, ox:1, oy:0, id:"right" },
    {x:0.5, y:0, ox:0, oy:-1, id:"top" },
    {x:0.5, y:1, ox:0, oy:1, id:"bottom" }
]
```

This array of anchor positions serves a dual purpose:

- it is used when dropping an edge on some element, to determine which anchor point is closest to where mouse button has been released
- it is used when editing an edge path, to define the positions to which the user can drag anchor points

This array is declared outside of the component.

### Component setup

The first section of code in the Flowchart component looks like this:

```javascript
const shapeLibrary = new ShapeLibraryImpl(FLOWCHART_SHAPES)

const pathEditor = useRef(null)
const surfaceComponent = useRef(null)
const miniviewContainer = useRef(null)
const controlsContainer = useRef(null)
const paletteContainer = useRef(null)
const inspectorContainer = useRef(null)

/**
 * Generator for data for nodes dragged from palette.
 * @param el
 */
const dataGenerator = (el) => {
    return {
        fill:DEFAULT_FILL,
        outline:DEFAULT_STROKE,
        textColor:DEFAULT_TEXT_COLOR
    }
}

const toolkit = newInstance()

initializeOrthogonalConnectorEditors()
```

The first thing we do is to declare a [Shape library](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/shape-libraries). This is a module that manages a set of named shapes that we will use to render SVG. We construct our library with `FLOWCHART_SHAPES`, a set of shapes that ship with the Toolkit since 6.2.0.

We then declare a few refs - one for the object we'll use to edit paths, one for our surface, and then a few for various DOM elements we're going to want access to in the `useEffect` hook discussed below.

`dataGenerator` is a function used by the palette from which the user drags new shapes onto the canvas. Its job is to take some DOM element as input (a DOM element that a user has started to drag from the palette), and to return an appropriate initial dataset for an object of that type. This is discussed in detail [in the drag and drop documentation](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/drag-and-drop).

Next, we create an instance of the Toolkit. We do not have any constructor params for the Toolkit in this application, but when constructing a Toolkit you can provide various things like a function to run before a connection can be established, initial mode for the Toolkit's selection, etc.

Finally in the setup of this component we call `initializeOrthogonalConnectorEditors()`. This is a method exported by `@jsplumbtoolkit/browser-ui` and calling it here ensures that the edge editors for Orthogonal connectors don't get tree-shaken out of our bundle.

### View

The [view](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/views) is where you map object types to their visual representations:

```javascript
const view = {
    nodes: {
        [DEFAULT]: {
            jsx: (ctx) => {
                return <NodeComponent ctx={ctx}  shapeLibrary={shapeLibrary}/>
            },
            events: {
                [EVENT_TAP]: (params) => {
                    pathEditor.current.stopEditing()
                    // if zero nodes currently selected, or the shift key wasnt pressed, make this node the only one in the selection.
                    if (toolkit.getSelection()._nodes.length < 1 || params.e.shiftKey !== true) {
                        toolkit.setSelection(params.obj)
                    } else {
                        // if multiple nodes already selected, or shift was pressed, add this node to the current selection.
                        toolkit.addToSelection(params.obj)
                    }
                }
            }
        }
    },
    // There are two edge types defined - 'yes' and 'no', sharing a common
    // parent.
    edges: {
        [DEFAULT]: {
            endpoint: BlankEndpoint.type,
            connector: {
                type: OrthogonalConnector.type,
                options: {
                    cornerRadius: 5
                }
            },
            cssClass:CLASS_FLOWCHART_EDGE,
            labelClass:CLASS_EDGE_LABEL,
            label:"{{label}}",
            outlineWidth:10,
            events: {
                [EVENT_DBL_CLICK]: (params) => {
                    toolkit.removeEdge(params.edge)
                },
                [EVENT_CLICK]: (params) => {
                    toolkit.setSelection(params.edge)
                    pathEditor.current.startEditing(params.edge, {
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
```


