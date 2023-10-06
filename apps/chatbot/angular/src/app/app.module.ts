import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { jsPlumbToolkitModule} from "@jsplumbtoolkit/browser-ui-angular"

import { AppComponent } from './app.component';
import {StartComponent} from "./start.component"
import {EndComponent} from "./end.component"
import {MessageComponent} from "./message.component"
import {InputComponent} from "./input.component"
import {ChoiceComponent} from "./choice.component"
import {TestComponent} from './test.component'
import {InspectorComponent} from "./inspector.component"

@NgModule({
  declarations: [
    AppComponent,
     StartComponent,
    EndComponent,
    MessageComponent,
    InputComponent,
    ChoiceComponent,
    InspectorComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
