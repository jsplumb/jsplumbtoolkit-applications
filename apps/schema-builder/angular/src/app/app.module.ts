import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { jsPlumbToolkitModule} from "@jsplumbtoolkit/browser-ui-angular"

import { AppComponent } from './app.component';
import {TableNodeComponent} from "./table.node.component"
import {ViewNodeComponent} from "./view.node.component"
import {ColumnComponent} from "./column.component"
import {InspectorComponent} from "./inspector.component"

@NgModule({
  declarations: [
    AppComponent, TableNodeComponent, ViewNodeComponent, ColumnComponent, InspectorComponent
  ],
  imports: [
    BrowserModule,
    jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
