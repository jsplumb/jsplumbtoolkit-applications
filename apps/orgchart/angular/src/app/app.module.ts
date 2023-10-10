import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {jsPlumbToolkitModule} from '@jsplumbtoolkit/browser-ui-angular'

import { AppComponent } from './app.component';
import {PersonComponent} from "./person.component"
import {InspectorComponent} from "./inspector.component"

@NgModule({
  declarations: [
    AppComponent, PersonComponent, InspectorComponent
  ],
  imports: [
    BrowserModule, jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
