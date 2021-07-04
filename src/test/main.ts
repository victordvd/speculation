import {NgModule, Component } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'my-app',
  template: '<h1>Hello {{name}}</h1>'
})
export class AppComponent { name = 'Angular'; }

@NgModule({
    declarations:[AppComponent], 
    imports:[BrowserModule],
    bootstrap:[AppComponent]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);