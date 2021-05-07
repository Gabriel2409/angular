create app

ng new myapp
cd myapp
ng serve

---------
in angular.json

add this to styles to use bootstrap
"node_modules/bootstrap/dist/css/bootstrap.min.css",

----- 
create component in cli
ng generate component servers OR ng g c servers

it automatically updates the declaration in the app.module.ts

-----
data binding : 
from ts to html 
string interpolation {{ myvar }} in the html references myvar in ts
property binding [property]="data"

Note in some cases they can be equivalent
<p>{{ myvar }}</p> <=> <p [innerText]="myvar"></p>


from html to ts
event binding (event)="expression"
$event keyword in html references the event

two way binding
[(ngModel)] = "data"
need forms module in app.component.ts
import { FormsModule } from '@angular/forms'

-------
constructor is called on creation of element

----
if directive : it has a star because it is a structural directive
<p *ngIf="this.serverCreated; else noServer">Server {{ serverName }} was created</p>
<ng-template #noServer>
	<p>no server was created</p>
</ng-template>


for loop : servers here is an array
<app-server *ngFor="let server of servers"></app-server>

----
attribute directive : only change element they were placed on (no start)

<p [ngStyle]="{backgroundColor: getColor()}" >Example</p>

add or remove class based on truthy value
<p [ngClass]="{online: serverStatus === 'online', offline: serverStatus === 'offline'}"></p>

example of for with index 
<p *ngFor="let c of clickArr; let i = index;" 
	[ngClass]="{'colored': i >= 5 }">{{c}} --- {{i}}</p>


---- ts classes : 
export class Ingredient {
  public name: string;
  public amount: number;

  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }
}


// * same as writing
export class Ingredient {
  constructor(public name: string, public amount: number) {}
}

---- pass data to child component =custom property binding
in parent : 
export class AppComponent {
  serverElements = [
    {
      type: "server",
      name: "TestServer",
      content: "Just a test",
    },
  ];
}

<app-server-element *ngFor="let serverElement of serverElements;" [element]="serverElement"></app-server-element>
in child : use Input decorator to expose element to the world
export class ServerElementComponent implements OnInit {
  @Input()
  element: {
    type: string;
    name: string;
    content: string;
  };

  constructor() {}

  ngOnInit(): void {}
}
Note : use @Input("myalias") to bind to [myalias] in parent component
-------

pass data to parent component -custom event emitter

In parent : 
<app-cockpit (serverAdded)="onServerAdded($event)"></app-cockpit>

 onServerAdded(serverData: { serverName: string; serverContent: string }) {
    this.serverElements.push({
      type: "server",
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }

In child : 
<button
    class="btn btn-primary"
    (click)="onAddServer()">Add Server</button>
<button


export class CockpitComponent implements OnInit {
  @Output()
  serverAdded = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();

  constructor() {}
  ngOnInit(): void {}
  onAddServer() {
    this.serverAdded.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent,
    });
  }
}

Note : use @Output("myalias") to bind to (myalias) in parent component


---- 
encapsulation :
angular adds these attributes to the DOM _ngcontent-hpn-c41
They depend on the component

If I pass
encapsulation: ViewEncapsulation.None
then they are not applied and the style defined in the css of the component are 
passed globally

encapsulation: ViewEncapsulation.Native should give the same results as Emulated (default value)
but only on browser that support the shadow DOM