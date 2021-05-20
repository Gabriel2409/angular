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

---
for structural directives, behind the scene, angular does not know *. In fact it transforms

<div *ngIf="!onlyOdd">
	<li class="list-group-item" *ngFor="let even of evenNumbers" [ngClass]="{odd:even % 2 !== 0}">
		{{ even }}
	</li>
</div>

into 
<ng-template [ngIf]="!onlyOdd">
	<div>
		<li class="list-group-item" *ngFor="let even of evenNumbers" [ngClass]="{odd:even % 2 !== 0}">
			{{ even }}
		</li>
	</div>
</ng-template>

So it is just a custom property binding in fact. And that explains the ng-template with the else

Example below : use with *appUnless="condition"
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appUnless]",
})
export class UnlessDirective {


  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      this.vcRef.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {}
}

----
ngSwitch
<div [ngSwitch]="value">
	<p *ngSwitchCase="5">Value is 5</p>
	<p *ngSwitchCase="10">Value is 10</p>
	<p *ngSwitchCase="100">Value is 100</p>
	<p *ngSwitchDefault>Value is Def</p>
</div>


---- 
services : they are standard class you put in a file : **.service.ts

export class LoggingService {
  logStatusChange(status: string) {
    console.log(`A server status changed, new status: ${status})`);
  }
}

Note : do not import the class and create a new instance when you want to use it, 
Angular has a built in way to get access to services.

Instead, you should import the service and put it in the constructor of your component
and the providers
import { Component, EventEmitter, Output } from "@angular/core";
import { LoggingService } from "../logging.service";

@Component({
  selector: "app-new-account",
  templateUrl: "./new-account.component.html",
  styleUrls: ["./new-account.component.css"],
  providers: [LoggingService],
})
export class NewAccountComponent {
  @Output() accountAdded = new EventEmitter<{ name: string; status: string }>();

  constructor(private loggingService: LoggingService) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountAdded.emit({
      name: accountName,
      status: accountStatus,
    });
    this.loggingService.logStatusChange(accountStatus);
  }
}

When you create a service, Angular knows how to create the service for the component
and also ALL the child components ! 

Hierarchichal injector: where to provide the service

AppModule : same instance of Service is available Application-wide
AppComponent: same instance of Service is available for all Components but not for other services
Any component: same instance of service is available for the component and all children components (and children of children)
Note : if you provide a service to a component and its child, the service provided in the child overwrites the one provided in the parent (new instance)
To use the instance of a parent, keep it in the constructor of the child but remove it from the providers list

---
New syntax for application wide services : 
Instead of adding a service class to the providers[]  array in AppModule , you can set the following config in @Injectable() :

    @Injectable({providedin: 'root'})
    export class myservice { ... }
This is exactly the same as:

    export class MyService { ... }

and

    import { MyService } from './path/to/my.service';
     
    @NgModule({
        ...
        providers: [MyService]
    })
    export class AppModule { ... }

To inject a service into a service, i need to provide it at app.module level 
and add @Injectable() on the service where i want to receive another service.
Alternatively, I can use Injectable with @Injectable({providedin: 'root'})) so that
I dont have to declare it in app.module.ts

Note : you need injectable if you inject in the service, not if you inject the service
somewhere else

--- Cross component communication
create an event emitter in the service
emit event in component A
subscribe to event in component B (in constructor for ex)

service : statusUpdated = new EventEmitter<string>()

comp A:	this.accountsService.statusUpdated.emit(status)

 ngOnInit() {this.accountsService.statusUpdated.subscribe((status:string)=>{alert(`New status ${status}`)})

 ------------- 
 routing

in app.module.ts
import { RouterModule, Routes } from "@angular/router";

then 
const appRoutes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "users", component: UsersComponent },
	{ path: "servers", component: ServersComponent },
];

then 
in  @NgModule, 
imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)],


in app.component.ts
use <router-outlet></router-outlet> to render your routes
In the example above, i can access my UsersComponent by going to /users

---Implementing navigation : do not just put a link with href as it will reload the app
Instead: use the routerLink directive
 <li role="presentation"><a routerLink="/servers">Servers</a></li>
 or 
 <li role="presentation"><a [routerLink]="['/users', 'something']">Users</a></li>

 Note : relative path can be used without the / or with ./
 It is also possible to use ../

---Attach a class to active route
routerLinkActive directive to attach a given class: note that by default, all the 
routes containing the path are active. 
<li role="presentation" routerLinkActive="active"><a routerLink="/servers">Servers</a></li>

It is possible to add additionnal config to fix this

	<li
		role="presentation"
		routerLinkActive="active"
		[routerLinkActiveOptions]="{ exact: true }"
	>

---- accessing router in ts file
import { Router } from '@angular/router';
...
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  onLoadServers() {
    // do sthg
    this.router.navigate(['/servers']);
  }
}
Note : unlike routerLink, this.router.navigate does not know on what route I am so I can omit the first /


If i want a relative route:
import { ActivatedRoute, Router } from '@angular/router';
add this in constructor : private route: ActivatedRoute
 onReload() {
    console.log('reload');
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  --- passing parameters
  in app.module, add this route with :id
  { path: 'users/:id', component: UserComponent },
  
  then in your component
   constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
    };
  }
