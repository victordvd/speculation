import {Component, Inject} from '@angular/core';
import {HTTP_PROVIDERS, Http} from '@angular/http';

@Component({
  selector: 'my-app',
  template: `
<h1>Tour of Heroes ({{mode}})</h1>
<h3>Heroes:</h3>
<ul>
  <li *ngFor="let hero of heroes">{{hero.name}}</li>
</ul>
<label>New hero name: <input #newHeroName /></label>
<button (click)="addHero(newHeroName.value); newHeroName.value=''">Add Hero</button>
<p class="error" *ngIf="errorMessage">{{errorMessage}}</p>
  `,
  providers: [HTTP_PROVIDERS, {provide:'API', useValue: 'https://swapi-json-server-vlhfwhtpic.now.sh'}],
})