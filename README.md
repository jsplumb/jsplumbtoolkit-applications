# jsplumbtoolkit-applications

Starter applications and feature demos built with the jsPlumb Toolkit. Starter applications are fully featured apps and most of them come in Vanilla JS, Angular, Vue 2, Vue 3, React and Svelte versions. Feature demonstrations are smaller demos that are focused on some specific aspect of the Toolkit's functionality, and do not use one of the library integrations, but the concepts are easily ported to an app that does use Angular etc.

Some feature demos are provided in a number of different versions - ES5, ES6 and Typescript. The versions available vary between the demos. 

## Requirements

You'll need to be a licensee or evaluator of the [jsPlumb Toolkit](https://jsplumbtoolkit.com) to use the applications in this repository.

If you are not a licensee or an evaluator, you can request an evaluation of the Toolkit [on our site](https://jsplumbtoolkit.com/trial).

### Evaluators

If you are an evaluator and you are accessing the starter apps and feature demos from your evaluation bundle, the Toolkit packages were delivered in the bundle and are referenced via `file:..` urls.  You can also access the Toolkit packages via our NPM repository, instructions for which can be found [here](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/npm-repository). 

### Licensees

Licensees who are logged in to our NPM repository can skip to installation at this point. If you are a licensee but you are not logged in to our NPM repository, you will either need to login to our repository (instructions for which can be found [here](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/npm-repository)), or provision the Toolkit packages via your own NPM repository, or local files.

## Installation

`package.json` contains targets for installing dependencies for each library integration separately, or all at once:

```bash
npm run install

npm run install:vanilla

npm run install:angular

npm run install:react

npm run install:vue2

npm run install:vue3

npm run install:svelte

```

## Building

`package.json` contains targets for building some given version of the apps (of all the apps and feature demos):

```bash

npm run build:vanilla
npm run build:angular
npm run build:react
npm run build:vue2
npm run build:vue3
npm run build:svelte

```

but you can also build one individually, for instance to build the vanilla JS Flowchart Builder starter application:

```
cd apps/flowchart-builder/vanilla
npm run build
```

## Serving apps

Each app can be run via npm, the command varying depending on the library integration:

#### Angular

`npm run start`

#### React

`npm run start`

#### Vue 2 / Vue 3

`npm run preview`

#### Svelte

`npm run start`

#### Vanilla

`npm run serve`

