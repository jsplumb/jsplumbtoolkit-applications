import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular"
import {NodeComponent} from "./node.component"
import {GroupComponent} from "./group.component"

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, NodeComponent, GroupComponent
  ],
  imports: [
    BrowserModule, jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
