import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';

import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular"
import { AppComponent } from './app.component';
import {WorldComponent} from "./world.component"
import {HelloComponent} from "./hello.component"

@NgModule({
  declarations: [
    AppComponent, WorldComponent, HelloComponent
  ],
  imports: [
    BrowserModule, jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
