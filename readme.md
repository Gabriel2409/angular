# Basics

in console: 
`create app`

`ng new myapp`
`cd myapp`
`ng serve`

---------
in angular.json

add this to styles to use bootstrap
`"node_modules/bootstrap/dist/css/bootstrap.min.css",`

----- 
create component in cli
`ng generate component servers` OR `ng g c servers`

it automatically updates the declaration in the app.module.ts

-----
## data binding 
###from ts to html 
string interpolation `{{ myvar }}` in the html references myvar in ts
property binding `[property]="data"`

Note in some cases they can be equivalent
`<p>{{ myvar }}</p>` <=> `<p [innerText]="myvar"></p>`


### from html to ts
event binding `(event)="expression"`
`$event` keyword in html references the event

### two way binding
`[(ngModel)] = "data"`
need forms module in app.component.ts
`import { FormsModule } from '@angular/forms'`

-------
## constructor
constructor is called on creation of element

----
## Directives
if directive : it has a star because it is a structural directive
```html
<p *ngIf="this.serverCreated; else noServer">Server {{ serverName }} was created</p>
<ng-template #noServer>
  <p>no server was created</p>
</ng-template>
```

for loop : servers here is an array
```html
<app-server *ngFor="let server of servers"></app-server>
```


attribute directive : only change element they were placed on (no start)

```html
<p [ngStyle]="{backgroundColor: getColor()}" >Example</p>
```

add or remove class based on truthy value
```html
<p [ngClass]="{online: serverStatus === 'online', offline: serverStatus === 'offline'}"></p>
```

example of for with index 
```html
<p *ngFor="let c of clickArr; let i = index;" 
	[ngClass]="{'colored': i >= 5 }">{{c}} --- {{i}}</p>
```

---- 
## ts classes 
```typescript
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
```
# Databinding

## pass data to child component = custom property binding

in parent : 
```typescript
export class AppComponent {
  serverElements = [
    {
      type: "server",
      name: "TestServer",
      content: "Just a test",
    },
  ];
}
```
```html
<app-server-element *ngFor="let serverElement of serverElements;" [element]="serverElement"></app-server-element>
```

in child : use Input decorator to expose element to the world
```typescript
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
```
Note use `@Input("myalias")` to bind to `[myalias]` in parent component

## pass data to parent component -custom event emitter

In parent : 
```html
<app-cockpit (serverAdded)="onServerAdded($event)"></app-cockpit>
```
```typescript
 onServerAdded(serverData: { serverName: string; serverContent: string }) {
    this.serverElements.push({
      type: "server",
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }
```
In child : 
```html
<button
    class="btn btn-primary"
    (click)="onAddServer()">Add Server</button>
<button
```
```typescript

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
```

Note : use `@Output("myalias")` to bind to `(myalias)` in parent component


## encapsulation :
angular adds these attributes to the DOM `_ngcontent-hpn-c41`
They depend on the component

If I pass
`encapsulation: ViewEncapsulation.None`
then they are not applied and the style defined in the css of the component are 
passed globally

`encapsulation: ViewEncapsulation.Native` should give the same results as `Emulated` (default value)
but only on browser that support the shadow DOM

 
## local reference in templates
add a #myname in a html element to reuse it inside the html template : 

```html
<input type="text" class="form-control" #serverNameInput>
<button
    class="btn btn-primary"
    (click)="onAddServer(serverNameInput)">Add Server</button>
<button
```
and in ts

```typescript
onAddServer(nameInput: HTMLInputElement) {
    this.serverAdded.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }
```
----
## Viewchild

lots of use (with local ref, or with component name directly)
Most used case = with local ref. Ex below

Unlike the local reference passed in the template that referenced the html element 
itself, when we pass the local ref in ViewChild, it is of type ElementRef

```html
<input type="text" class="form-control" #serverContentInput>
```

```typescript
@ViewChild("serverContentInput") servContent: ElementRef;

onAddServer(nameInput: HTMLInputElement) {
    this.serverAdded.emit({
      serverName: nameInput.value,
      serverContent: this.servContent.nativeElement.value,
    });
  }
``` 

Note : do not change the element through this, it is bad. Angular offers a better way to access the DOM

## projecting content with ng-content
by default, what is between two components html tags is not shown. Except if you put a ng-content

ex : in parent
```html
<app-child>Extra content</app-child>
```
in child:
```html
<p>Regular content</p>
<ng-content></ng-content>
```
------ 
### Component lifecycle

* `ngOnChanges`				called after a bound input property changes <- properties decorated with @Input / receives an argument of type `SimpleChanges`
* `ngOnInit`				called once the component is initialized <- runs after the constructor
* `ngDoCheck`				called during every change detection run <- is called a lot
* `ngAfterContentInit`		called after content (ng-content) has been projected into view
* `ngAfterContentChecked`	called every time the projected content has been checked (by angular change detection)
* `ngAfterViewInit`			called after the component's view (and child views) has been initialized 
* `ngAfterViewChecked`		called every time the view (and child views) have been checked
* `ngOnDestroy`				called once the component is about to be destroyed


Note : not possible to access templates ref before `ngAfterViewInit`

----
## ContentChild 
same as view child 
in parent : 
```html
<p #contentParagraph>Extra content</p>
```
in child html : 
```html
<ng-content></ng-content>
```
In child ts : 
```typescript
@ContentChild("contentParagraph", { static: true }) paragraph: ElementRef;
```
Can be accessed on `ngAfterContentInit`


# Directives deep dive 
* attribute : only affect the element they are on
* structural : affect the dom 

Note : you cant have more than one structural directive on an element (no *ngFor + *ngIf)

## Custom directive 
```typescript
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
```

In app.module.ts, i need to import and declare it
To use it, no square bracket 
```html
<p appBetterHighlight>Style me with better directive</p>
```
----

Note : Generate a directive with `ng g d`
Note : renderer is the preferred way to change style because angular is not limited to the browser
and can work in services who have no access to the dom

---
## host listener
host listener to listen to events in directives
```typescript
@HostListener("mouseenter") mouseover(eventData: Event) {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "blue"
    );
  }
```
-----
## host binding

  host binding to bind a property of the element the directive is applied to
  ```typescript
  @HostBinding("style.backgroundColor") backgroundColor: string;
 ```

-----

  ## Custom property binding in directive :
in the directive ts file I can add input and then use a custom property binding on the 
element where there is the directive
   ```typescript
@Input() defaultColor: string = "transparent";
@Input() highlightColor: string = "blue";
   ```
 ```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">Style me with better directive</p>
  ```

  Another solution if i have one main input; I can put directive between []
```typescript
@Input("appBetterHighlight") highlightColor: string = "blue";
```
```html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">Style me with better directive</p>
```

Note : in angular, if we pass a string, we can omit the [] if we omit the '' :
example `[defaultColor]="'yellow'"` is the same as `defaultColor="yellow"`

## Structural directives : behind the scenes
for structural directives, behind the scene, angular does not know *. In fact it transforms

```html
<div *ngIf="!onlyOdd">
  <li class="list-group-item" 
      *ngFor="let even of evenNumbers" 
      [ngClass]="{odd:even % 2 !== 0}"
   >
    {{ even }}
  </li>
</div>
```
into 
```html
<ng-template [ngIf]="!onlyOdd">
  <div>
    <li class="list-group-item" 
        *ngFor="let even of evenNumbers" 
        [ngClass]="{odd:even % 2 !== 0}"
	>
	{{ even }}
	</li>
  </div>
</ng-template>
```

So it is just a custom property binding in fact. And that explains the ng-template with the else

Example below : use with `*appUnless="condition"`
```typescript
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
```
----
## ngSwitch
```html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchCase="100">Value is 100</p>
  <p *ngSwitchDefault>Value is Def</p>
</div>
```
---- 

# Services
they are standard class you put in a file : **.service.ts

## Creation
```typescript
export class LoggingService {
  logStatusChange(status: string) {
    console.log(`A server status changed, new status: ${status})`);
  }
}
```
Note : do not import the class and create a new instance when you want to use it, 
Angular has a built in way to get access to services.

Instead, you should import the service and put it in the constructor of your component
and the providers
```typescript
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
```
## Hierarchichal injector

When you create a service, Angular knows how to create the service for the component
and also ALL the child components ! 

Hierarchichal injector: where to provide the service

* AppModule : same instance of Service is available Application-wide
* AppComponent: same instance of Service is available for all Components but not for other services
* Any component: same instance of service is available for the component and all children components (and children of children)
* Note : if you provide a service to a component and its child, the service provided in the child overwrites the one provided in the parent (new instance)
To use the instance of a parent, keep it in the constructor of the child but remove it from the providers list

---
New syntax for application wide services : 
Instead of adding a service class to the providers[]  array in AppModule , you can set the following config in @Injectable() :
```typescript
@Injectable({providedin: 'root'})
export class myservice { ... }
```
This is exactly the same as:
```typescript
export class MyService { ... }
```
and

```typescript
import { MyService } from './path/to/my.service';
     
@NgModule({
    ...
    providers: [MyService]
    })
export class AppModule { ... }
```

To inject a service into a service, i need to provide it at app.module level 
and add `@Injectable()` on the service where i want to **RECEIVE** another service.
Alternatively, I can use Injectable with `@Injectable({providedin: 'root'})` so that I dont have to declare it in app.module.ts

Note : you need injectable if you inject in the service, not if you inject the service somewhere else

----

## Cross component communication
create an event emitter in the service
emit event in component A
subscribe to event in component B (in constructor for ex)

service : 
```typescript
statusUpdated = new EventEmitter<string>()
```
comp A:	
```typescript
this.accountsService.statusUpdated.emit(status)
```
comp B:	
```typescript
ngOnInit() {
  this.accountsService.statusUpdated.subscribe(
    (status:string)=>{alert(`New status ${status}`)}
  )
```

------------- 
# Routing
## imports
in app.module.ts
```typescript
import { RouterModule, Routes } from "@angular/router";
```
then 
```typescript
const appRoutes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "users", component: UsersComponent },
	{ path: "servers", component: ServersComponent },
];
```

then 
in  `@NgModule`, 
`imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)]`,


in app.component.ts
use 
```html
<router-outlet></router-outlet> 
```
to render your routes
In the example above, i can access my UsersComponent by going to /users

---
## Implementing navigation : 
do not just put a link with href as it will reload the app
Instead: use the routerLink directive
```html
<li role="presentation">
  <a routerLink="/servers">Servers</a>
</li>
```
 or 

```html
<li role="presentation">
  <a [routerLink]="['/users', 'something']">Users</a>
</li>
```
Note : relative path can be used without the / or with ./
It is also possible to use ../

## Attach a class to active route
routerLinkActive directive to attach a given class: note that by default, all the 
routes containing the path are active. 
```html```
<li role="presentation" routerLinkActive="active">
  <a routerLink="/servers">Servers</a>
</li>
```
It is possible to add additionnal config to fix this
```html
<li
  role="presentation"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{ exact: true }"
>
```

## Accessing router in ts file
```typescript
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
```
Note : unlike routerLink, this.router.navigate does not know on what route I am so I can omit the first /


If i want a relative route:
```typescript
import { ActivatedRoute, Router } from '@angular/router';
constructor(..., private route: ActivatedRoute)

 onReload() {
    console.log('reload');
    this.router.navigate(['./'], { relativeTo: this.route });
  }
```
## Passing parameters
in app.module, add this route with :id

`{ path: 'users/:id', component: UserComponent },`
  
then in your component
```typescript
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  this.user = {
      id: this.route.snapshot.params['id'],
    };
  }
```
 potential error : if i reacess the same component for ex with
```html
<a [routerLink]="['/users', 10, 'Anna']">Load Anna (10)</a>, 
```
 
then when I click on the link,
the route is changed but the component is NOT rerendered as it is on the same route, which means ngOnInit is not executed
So in ngOnInit, it is fine to use the snapshot approach. But we must add something to react to changes
```typescript

this.route.params.subscribe((params: Params) => {
  this.user.id = params['id'];
  this.user.name = params['name'];
});

```
it is good to implement the onDestroy lifecycle to remove the subscription when component is destroyed
(though for routes it is not required as angular handles it). 
Final code : 
```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: { id: number; name: string };	
  paramSubscription: Subscription
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name'],
    };
    this.paramSubscription = this.route.params.subscribe((params: Params) => {
      this.user.id = params['id'];
      this.user.name = params['name'];
    });
  }
  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }
}
```

## Query parameters
```html
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit:1}"
  [fragment]="'loading'"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers"
>
  {{ server.name }}
</a>
```
 links to 

`/servers/5/edit?allowEdit=1#loading`

TO do it in a ts file : 
```typescript
onLoadServer(id: number) {
  this.router.navigate(['/servers', id, 'edit'], {
    queryParams: { allowEdit: 1 },
    fragment: 'loading',
    });
  }
```
----
Retrieve query parameters and fragment:

first approach, in ngOnInit: `this.route.snapshot.queryParams` and `this.route.snapshot.fragment`

To react on changes, same logic as before, we can subscribe
`this.route.queryParams.subscribe()` and `this.route.fragment.subsribe()`

NOTE : params are recovered as string. To get them as nb, you can do `+this.route.snapshot.params['id']`

## Nested routes : 
possibility to add children in routes. Then in coresponding component, we must add a <router-outlet></router-outlet>

```typescript
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    component: UsersComponent,
    children: [{ path: ':id/:name', component: UserComponent }],
  },
  {
    path: 'servers',
    component: ServersComponent,
    children: [
      { path: ':id', component: ServerComponent },
      { path: ':id/:name', component: EditServerComponent },
    ],
  },
];
```
## query params handling when changing route

```typescript
this.router.navigate(['edit'], { relativeTo: this.route, queryParamsHandling: 'merge' }); // merge with queryParams of next route
this.router.navigate(['edit'], { relativeTo: this.route, queryParamsHandling: 'preserve' }); // keeps queryparams of previous route
```

## redirect 
```typescript
{ path: 'not-found', component: PageNotFoundComponent },
{ path: 'something', redirectTo: "not-found"},

// Note : if you want full path matching
{ path: '', redirectTo: '/somewhere-else', pathMatch: 'full' }
```

--- wildcard redirect : 
```typescript
{ path: '**', redirectTo: "not-found"},
```
BE SURE THIS ROUTE IS THE LAST

## outsourcing the route config
in app-routing.module.ts

```typescript
import ...

const appRoutes: Routes = [
  ... all the paths
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule], // exposes the router to the other modules
})
export class AppRoutingModule {}
```

in app.module.ts
```typescript
imports: [BrowserModule, FormsModule, AppRoutingModule],
```


## guard : code executed on access / leave of route
First create a guard with a canActivate method
for ex: 
```typescript
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().then((authenticated: boolean) => {
      if (authenticated) {
        return true;
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
```

Add this in the route where we want to protect : 
`canActivate: [AuthGuard],`

Note : remember to add the imported services to app.module.ts

## protect child routes

Same logic but we create a function called canActivateChild and put it into the route

## protect exit from route with canDeactivate:
It is a bit more complex as the CanDeactivate interface needs a component. A generic way 
to implement it would be to create a file can-deactivate-guard.service.ts
```typescript
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanDeactivate,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () =>
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}

export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return component.canDeactivate();
  }
}
```
And then in the component where i want to implement the guard, i implement the canDeactivate method with no args
``` typescript
 canDeactivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.allowEdit) {
      return true;
    } else {
      if (
        this.serverName !== this.server.name ||
        (this.serverStatus !== this.server.status && !this.changesSaved)
      ) {
        return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }
    }
  }
```
And then i add it to the app-routing.module and the providers of app.module

Note : it i want to tie the canDeactivate to a specific component, i can use it
directly instead of creating the CanComponentDeactivate interface

## passing static data to a route
```typescript
in app-routing: 
 {
    path: 'not-found',
    component: ErrorPageComponent,
    data: { message: 'Page Not Found!' },
  },
```
in component : either option 1 or commented option works
```typescript
  ngOnInit(): void {
	  this.errorMessage = this.route.snapshot.data["message"]
	//   this.route.data.subscribe(( data:Data )=>{
	// 	  this.errorMessage = data["message"]
	//   })
  }
```
## passing dynamic data : use of a resolve service :
```typescript 
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs/Observable";
import { ServersService } from "../servers.service";

interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolver implements Resolve<Server>{

  constructor(private serversService: ServersService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Server> | Promise<Server> | Server {
    return this.serversService.getServer(+route.params["id"])
  }
}
```
Then i add it to the providers in app.module
Then in app-routing.module: 
```typescript
{ path: ':id', component: ServerComponent, resolve: {server: ServerResolver} }
```

and in my component, i subscribe to the route data
```typescript
ngOnInit() {
  this.route.data.subscribe((data: Data)=>{
    this.server = data["server"]
  })  
}
```

---- LOCATION STRATEGY
the server must be configured so that a 404 returns the index html so that angular can then parse the route
Alternative approach using a hash sign : in app.routing, you can pass an arg to RouterModule.forRoot : {useHash: True}

# Observables
## theory
An observable is a datasource (events, http requests, triggered in code..)

An observer is our code : for ex our subscribe functions
Three ways to handle it: 
* handle data
* handle error
* handle completion

Note: some observables never complete; Others such as http requests will complete eventually
Observables are another approach at handling asynchronous events

## route params observable : 
```typescript
ngOnInit() {
  this.route.params.subscribe((params: Params) => {
    this.id = +params.id;
  });
}
```
Here params is a built in observable and subscribe is our observer.  

## subscribe/unsubscribe
Observables are not core js/ts features. Instead they come from a package called rxjs

example :
```typescript 
import { interval } from 'rxjs';
...
ngOnInit() {
  interval(1000) // fires an event every second
  .subscribe((count) => {
    console.log(count);
  });
}
```
interval fires an event each 1000 ms here. When i navigate away from my component, it keeps on counting. 
Note : certain observables emit values only once such as an http request but some of them will keep emitting values even if you are not interested in them anymore.
To prevent memory leaks you must unsubsribe to observables you are not interested in anymore. 
Final implementation : 
```typescript 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
...
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;
  constructor() {}

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.firstObsSubscription = interval(1000).subscribe((count) => {
      console.log(count);
    });
  }
}
```
Note : observables provided by angular (such as route.params) are managed by angular and will therefore be unsubscribed automatically

## Custom observable
To build the same interval manually : 

```typescript
import {  Observable } from 'rxjs';
...

export class HomeComponent implements OnInit, OnDestroy {
  ...
  ngOnInit() {
    const customIntervalObservable = Observable.create((observer) => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if (count >3){
          observer.error(new Error("Count is greater than 3"))
		}
        count += 1;
      }, 1000);
    });

    this.firstObsSubscription = customIntervalObservable.subscribe(count={
      console.log(count)
	}, 
    error=>{
      console.log(error)
	})
  }
}
```
the observer has three differents methods : 
* `next` : emits the next event 
* `error` 
* `complete` 

## error and completion
After an error, the observable stops emitting. Error should be handled : 

```typescript
  ngOnInit() {
    const customIntervalObservable = Observable.create((observer) => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
		if (count == 2) observer.complete()
        if (count > 3) {
          observer.error(new Error('Count is greater than 3'));
        }
        count += 1;
      }, 1000);
    });

    this.firstObsSubscription = customIntervalObservable.subscribe(
      (count) => {
        console.log(count);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      }
    );
  }
```
Observables such as Http requests automatically complete. On the other hand, interval never completes. To complete our custom observable, 
```typescript
if (count === 2) observer.complete();
```

```typescript
this.firstObsSubscription = customIntervalObservable.subscribe(
  (count) => {
    console.log(count);
  },
  (error) => {
    console.log(error);
    alert(error.message);
  },
  // completion handler function (no arg)
  () => {
    console.log("Cleaning up")
  }
);
```
Now we dont have the error at count >3 because it stops emitting when complete is called

NOTE : after completion or error, no need to unsubscribe, but we can add the unsubscription anyways
VERY IMPORTANT : completion is not fired in case of error

## Operators
Magic feature of rxjs library
You can use operators between the observable and the subscriptions. 
Which means the datapoints first reach the operators before the subscription. 
So you can subscribe to the result of these operators
Operators are used with pipe; Every observable has a pipe method

```typescript
import { map } from 'rxjs/operators';
...
this.firstObsSubscription = customIntervalObservable
.pipe(
  map((data: number) => {
    return 'Round: ' + (data + 1);
  })
)
.subscribe(...);
  }
```
Now the map operator allow us to transform the data before receiving it in the subscribe method
You can chain arguments in pipe. List here https://www.learnrxjs.io/learn-rxjs/operators 

```typescript
import { map, filter } from 'rxjs/operators';
...

.pipe(
  filter((data) => {
    return data > 0; // return true or false
  }),
  map((data: number) => {
    return 'Round: ' + (data + 1);
  })
)
```

## Subjects
Functions the same way as event emitter (approximation). Should be used in cross component communication : seems like they are more efficient
In the service : 
```typescript
import { Injectable } from '@angualr/core';
import { Subject } from 'rxjs';

@Injectable({provideIn: 'root'})
export class MyService {
  myEmitter = new Subject<number>()
}
```

In the component where you emit
```typescript
constructor(private myService: Myservice){}
...
this.myService.myEmitter.next(true)
```

In the component where you subscribe
```typescript
constructor(private myService: Myservice){}
...
ngOnInit(){
  this.myService.myEmitter.subscribe(data=> console.log(data))
}
```

In observables, we could call next from the inside but with Subject, i can call
next from the outside, which is why i can call next from a component, which makes it perfect as an event emitter. 
Rule : 
* only use event emitter in conjuction with @Output
* for cross component communication, use Subject
Note : same as observable, you can use operators
Dont forget to unsubscribe in ngOnDestroy

# Forms
## TODO
## TODO
## TODO

# Pipes
## Main purpose
Transform output in your templates
For ex, in your template, use the builtin uppercase pipe : 
```html
<p>{{ username | uppercase}}</p>
```
it will modify what is shown without modifying the property
Note : `|` is a symbol called "pipe" hence the name "pipes"

## Parametrizing Pipes
To configure a pipe, you add a `:`
Example with the built in date pipe : 
```html
{{ server.started  | date:'fullDate' }}
```
Note : if a pipe takes several parameters, you would do something like
```html
{{ myproperty  | mypipe:'value1':'value2' }}
```

## Where to learn more
https://angular.io/api?type=pipe 
for ex, the slice pipe : 
```html   
{{ value_expression | slice : start [ : end ] }}
```
## Chaining multiple pipes
```html  
{{ server.started  | date:'fullDate' | uppercase}}
```
Order is important (generally parsed from left to right)