import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'

import { AppComponent } from './app.component';

import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular"
import {NodeComponent} from "./node.component"

import {InspectorComponent} from "./inspector.component"

@NgModule({
    declarations: [
        AppComponent, NodeComponent, InspectorComponent

    ],
    imports: [
        BrowserModule,
        jsPlumbToolkitModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
