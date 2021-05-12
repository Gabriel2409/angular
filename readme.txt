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


---- 
local reference in templates
add a #myname in a html element to reuse it inside the html template : 

<input type="text" class="form-control" #serverNameInput>
<button
        class="btn btn-primary"
        (click)="onAddServer(serverNameInput)">Add Server</button>
      <button

and in ts

onAddServer(nameInput: HTMLInputElement) {

    this.serverAdded.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }

----
viewchild : lots of use (with local ref, or with component name directly)
Most used case = with local ref. Ex below

Unlike the local reference passed in the template that refereced the html element 
itself, when we pass the local ref in ViewChild, it is of type ElementRef

<input type="text" class="form-control" #serverContentInput>


@ViewChild("serverContentInput") servContent: ElementRef;

onAddServer(nameInput: HTMLInputElement) {
    this.serverAdded.emit({
      serverName: nameInput.value,
      serverContent: this.servContent.nativeElement.value,
    });
  }

Note : do not change the element through this, it is bad. Angular offers a better way to access the DOM

---- projecting content with ng-content
by default, what is between two components html tags is not shown. Except if you put a ng-content

ex : in parent
<app-child>Extra content</app-child>
in child:
<p>Regular content</p>
<ng-content></ng-content>

------ Component lifecycle -----

ngOnChanges				called after a bound input property changes <- properties decorated with @Input / receives an argument of type SimpleChanges
ngOnInit				called once the component is initialized <- runs after the constructor
ngDoCheck				called during every change detection run <- is called a lot
ngAfterContentInit		called after content (ng-content) has been projected into view
ngAfterContentChecked	called every time the projected content has been checked (by angular change detection)
ngAfterViewInit			called after the component's view (and child views) has been initialized 
ngAfterViewChecked		called every time the view (and child views) have been checked
ngOnDestroy				called once the component is about to be destroyed


Note : not possible to access templates ref before ngAfterViewInit

----
ContentChild : same as view child 
in parent : 
<p #contentParagraph>Extra content</p>
in child html : 
<ng-content></ng-content>
In child ts : 
@ContentChild("contentParagraph", { static: true }) paragraph: ElementRef;
Can be accessed on ngAfterContentInit



----
directives : 
attribute : only affect the element they are on
structural : affect the dom 
Note : you cant have more than one structural directive on an element (no ngfor + ng if)

custom directive 
import { Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appBetterHighlight]",
})
export class BetterHighlightDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "blue"
    );
  }
}

In app.module.ts, i need to import and declare it
To use it, no square bracket 
<p appBetterHighlight>Style me with better directive</p>

----
Note : Generate a directive with ng g d
Note : renderer is the preferred way to change style because angular is not limited to the browser
and can work in services who have no access to the dom

---
host listener to listen to events in directives
@HostListener("mouseenter") mouseover(eventData: Event) {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "blue"
    );
  }
-----
  host binding to bind a property of the element the directive is applied to
  @HostBinding("style.backgroundColor") backgroundColor: string;
------
  Custom property binding in directive :
  in the directive ts file I can add input and then use a custom property binding on the 
  element where there is the directive
  @Input() defaultColor: string = "transparent";
  @Input() highlightColor: string = "blue";

  <p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">Style me with better directive</p>

  Another solution if i have one main input; I can put directive between []

   @Input("appBetterHighlight") highlightColor: string = "blue";
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">Style me with better directive</p>

Note : in angular, if we pass a string, we can omit the [] if we omit the '' :
example [defaultColor]="'yellow'" is the same as defaultColor="yellow"

