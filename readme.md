<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Basics](#basics)
  - [data binding](#data-binding)
    - [from ts to html](#from-ts-to-html)
    - [from html to ts](#from-html-to-ts)
    - [two way binding](#two-way-binding)
  - [constructor](#constructor)
  - [Directives](#directives)
  - [ts classes](#ts-classes)
- [Databinding](#databinding)
  - [pass data to child component = custom property binding](#pass-data-to-child-component-custom-property-binding)
  - [pass data to parent component -custom event emitter](#pass-data-to-parent-component-custom-event-emitter)
  - [encapsulation :](#encapsulation)
  - [local reference in templates](#local-reference-in-templates)
  - [Viewchild](#viewchild)
  - [projecting content with ng-content](#projecting-content-with-ng-content)
    - [Component lifecycle](#component-lifecycle)
  - [ContentChild](#contentchild)
- [Directives deep dive](#directives-deep-dive)
  - [Custom directive](#custom-directive)
  - [host listener](#host-listener)
  - [host binding](#host-binding)
  - [Custom property binding in directive :](#custom-property-binding-in-directive)
  - [Structural directives : behind the scenes](#structural-directives-behind-the-scenes)
  - [ngSwitch](#ngswitch)
- [Services](#services)
  - [Creation](#creation)
  - [Hierarchichal injector](#hierarchichal-injector)
  - [Cross component communication](#cross-component-communication)
- [Routing](#routing)
  - [imports](#imports)
  - [Implementing navigation :](#implementing-navigation)
  - [Attach a class to active route](#attach-a-class-to-active-route)
  - [Accessing router in ts file](#accessing-router-in-ts-file)
  - [Passing parameters](#passing-parameters)
  - [Query parameters](#query-parameters)
  - [Nested routes :](#nested-routes)
  - [query params handling when changing route](#query-params-handling-when-changing-route)
  - [redirect](#redirect)
  - [outsourcing the route config](#outsourcing-the-route-config)
  - [guard : code executed on access / leave of route](#guard-code-executed-on-access-leave-of-route)
  - [protect child routes](#protect-child-routes)
  - [protect exit from route with canDeactivate:](#protect-exit-from-route-with-candeactivate)
  - [passing static data to a route](#passing-static-data-to-a-route)
  - [passing dynamic data : use of a resolve service :](#passing-dynamic-data-use-of-a-resolve-service)
- [Observables](#observables)
  - [theory](#theory)
  - [route params observable :](#route-params-observable)
  - [subscribe/unsubscribe](#subscribeunsubscribe)
  - [Custom observable](#custom-observable)
  - [error and completion](#error-and-completion)
  - [Operators](#operators)
  - [Subjects](#subjects)
- [Forms](#forms)
  - [Template Driven Approach](#template-driven-approach)
    - [Form Basics](#form-basics)
    - [Getting the js object](#getting-the-js-object)
    - [Another way to submit with ViewChild](#another-way-to-submit-with-viewchild)
  - [Reactive Approach](#reactive-approach)
- [Pipes](#pipes)
  - [Main purpose](#main-purpose)
  - [Parametrizing Pipes](#parametrizing-pipes)
  - [Where to learn more](#where-to-learn-more)
  - [Chaining multiple pipes](#chaining-multiple-pipes)
  - [Creating a custom pipe :](#creating-a-custom-pipe)
  - [Creating a filter pipe](#creating-a-filter-pipe)
  - [Async pipe](#async-pipe)
- [Http requests](#http-requests)
  - [Create db service in firestore :](#create-db-service-in-firestore)
  - [Sending post request](#sending-post-request)
  - [Get requests](#get-requests)
  - [Using rxjs operators to transform response data](#using-rxjs-operators-to-transform-response-data)
  - [Types with http client](#types-with-http-client)
  - [Using services](#using-services)
  - [Delete request](#delete-request)
  - [Error handling](#error-handling)
    - [Standard way](#standard-way)
    - [With subject](#with-subject)
    - [catchError operator](#catcherror-operator)
  - [Setting headers](#setting-headers)
  - [Query params](#query-params)
  - [Observing different types of response.](#observing-different-types-of-response)
  - [Response type](#response-type)
  - [Interceptor](#interceptor)
    - [Providing the service](#providing-the-service)
    - [Modify the request object inside the interceptor](#modify-the-request-object-inside-the-interceptor)
    - [Response interceptor](#response-interceptor)
  - [Multiple interceptors](#multiple-interceptors)
- [OTHER STUFF](#other-stuff)
  - [TODO](#todo)
  - [TODO](#todo-1)
  - [TODO](#todo-2)
  - [TODO](#todo-3)
- [Unit Testing](#unit-testing)
  - [Testing app.component](#testing-appcomponent)
  - [Testing a basic component](#testing-a-basic-component)
  - [Testing dependencies: components and services](#testing-dependencies-components-and-services)

<!-- /code_chunk_output -->

# Basics

in console:
`create app`

`ng new myapp`
`cd myapp`
`ng serve`

---

in angular.json

add this to styles to use bootstrap
`"node_modules/bootstrap/dist/css/bootstrap.min.css",`

---

create component in cli
`ng generate component servers` OR `ng g c servers`

it automatically updates the declaration in the app.module.ts

---

## data binding

### from ts to html

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

---

## constructor

constructor is called on creation of element

---

## Directives

if directive : it has a star because it is a structural directive

```html
<p *ngIf="this.serverCreated; else noServer">
  Server {{ serverName }} was created
</p>
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
<p [ngStyle]="{backgroundColor: getColor()}">Example</p>
```

add or remove class based on truthy value

```html
<p
  [ngClass]="{online: serverStatus === 'online', offline: serverStatus === 'offline'}"
></p>
```

example of for with index

```html
<p *ngFor="let c of clickArr; let i = index;" [ngClass]="{'colored': i >= 5 }">
  {{c}} --- {{i}}
</p>
```

---

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
      type: 'server',
      name: 'TestServer',
      content: 'Just a test',
    },
  ];
}
```

```html
<app-server-element
  *ngFor="let serverElement of serverElements;"
  [element]="serverElement"
></app-server-element>
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
<input type="text" class="form-control" #serverNameInput />
<button class="btn btn-primary" (click)="onAddServer(serverNameInput)">
  Add Server
</button>
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

---

## Viewchild

lots of use (with local ref, or with component name directly)
Most used case = with local ref. Ex below

Unlike the local reference passed in the template that referenced the html element
itself, when we pass the local ref in ViewChild, it is of type ElementRef

```html
<input type="text" class="form-control" #serverContentInput />
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

---

### Component lifecycle

- `ngOnChanges` called after a bound input property changes <- properties decorated with @Input / receives an argument of type `SimpleChanges`
- `ngOnInit` called once the component is initialized <- runs after the constructor
- `ngDoCheck` called during every change detection run <- is called a lot
- `ngAfterContentInit` called after content (ng-content) has been projected into view
- `ngAfterContentChecked` called every time the projected content has been checked (by angular change detection)
- `ngAfterViewInit` called after the component's view (and child views) has been initialized
- `ngAfterViewChecked` called every time the view (and child views) have been checked
- `ngOnDestroy` called once the component is about to be destroyed

Note : not possible to access templates ref before `ngAfterViewInit`

---

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

- attribute : only affect the element they are on
- structural : affect the dom

Note : you cant have more than one structural directive on an element (no *ngFor + *ngIf)

## Custom directive

```typescript
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'background-color',
      'blue'
    );
  }
}
```

In app.module.ts, i need to import and declare it
To use it, no square bracket

```html
<p appBetterHighlight>Style me with better directive</p>
```

---

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

---

## host binding

host binding to bind a property of the element the directive is applied to

```typescript
@HostBinding("style.backgroundColor") backgroundColor: string;
```

---

## Custom property binding in directive :

in the directive ts file I can add input and then use a custom property binding on the
element where there is the directive

```typescript
@Input() defaultColor: string = "transparent";
@Input() highlightColor: string = "blue";
```

```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">
  Style me with better directive
</p>
```

Another solution if i have one main input; I can put directive between []

```typescript
@Input("appBetterHighlight") highlightColor: string = "blue";
```

```html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">
  Style me with better directive
</p>
```

Note : in angular, if we pass a string, we can omit the [] if we omit the '' :
example `[defaultColor]="'yellow'"` is the same as `defaultColor="yellow"`

## Structural directives : behind the scenes

for structural directives, behind the scene, angular does not know \*. In fact it transforms

```html
<div *ngIf="!onlyOdd">
  <li
    class="list-group-item"
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
    <li
      class="list-group-item"
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
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]',
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

---

## ngSwitch

```html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchCase="100">Value is 100</p>
  <p *ngSwitchDefault>Value is Def</p>
</div>
```

---

# Services

they are standard class you put in a file : \*\*.service.ts

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
import { Component, EventEmitter, Output } from '@angular/core';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
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

- AppModule : same instance of Service is available Application-wide
- AppComponent: same instance of Service is available for all Components but not for other services
- Any component: same instance of service is available for the component and all children components (and children of children)
- Note : if you provide a service to a component and its child, the service provided in the child overwrites the one provided in the parent (new instance)
  To use the instance of a parent, keep it in the constructor of the child but remove it from the providers list

---

New syntax for application wide services :
Instead of adding a service class to the providers[] array in AppModule , you can set the following config in @Injectable() :

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

---

## Cross component communication

- create a subject in the service
- emit event in component A
- subscribe to event in component B (in constructor for ex)
- Note: it is better to use subject than EventEmitter

service :

```typescript
import { Subject } from 'rxjs'
...
statusUpdated = new Subject<string>();
```

comp A:

```typescript
this.accountsService.statusUpdated.next(status);
```

comp B:

```typescript
ngOnInit() {
  this.accountsService.statusUpdated.subscribe(
    (status:string)=>{alert(`New status ${status}`)}
  )
```

---

# Routing

## imports

in app.module.ts

```typescript
import { RouterModule, Routes } from '@angular/router';
```

then

```typescript
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'servers', component: ServersComponent },
];
```

then
in `@NgModule`,
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

```html
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
></li>
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
  paramSubscription: Subscription;
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

---

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
this.router.navigate(['edit'], {
  relativeTo: this.route,
  queryParamsHandling: 'merge',
}); // merge with queryParams of next route
this.router.navigate(['edit'], {
  relativeTo: this.route,
  queryParamsHandling: 'preserve',
}); // keeps queryparams of previous route
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

```typescript
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
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServersService } from '../servers.service';

interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolver implements Resolve<Server> {
  constructor(private serversService: ServersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Server> | Promise<Server> | Server {
    return this.serversService.getServer(+route.params['id']);
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

- handle data
- handle error
- handle completion

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

- `next` : emits the next event
- `error`
- `complete`

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
    console.log('Cleaning up');
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

@Injectable({ provideIn: 'root' })
export class MyService {
  myEmitter = new Subject<number>();
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

- only use event emitter in conjuction with @Output
- for cross component communication, use Subject
  Note : same as observable, you can use operators
  Dont forget to unsubscribe in ngOnDestroy

# Forms

## Template Driven Approach

### Form Basics

In app.module.ts

```javascript
import { FormsModule } from '@angular/forms';
```

Now, each time there is a form element in the code, angular will automatically create a js object representing the form.

In the html file

```html
<form>
  <div id="user-data">
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        class="form-control"
        ngModel
        name="username"
      />
    </div>
    <button class="btn btn-default" type="button">Suggest an Username</button>
    <div class="form-group">
      <label for="email">Mail</label>
      <input
        type="email"
        id="email"
        class="form-control"
        ngModel
        name="email"
      />
    </div>
  </div>
  <div class="form-group">
    <label for="secret">Secret Questions</label>
    <select id="secret" class="form-control" ngModel name="secret">
      <option value="pet">Your first Pet?</option>
      <option value="teacher">Your first teacher?</option>
    </select>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

- First thing to note : no method / action specified in the form because Angular will handle the form
- Rest of the form is standard html form
- Add controls to the angular js object with ngModel. Note that we do not use [()]. We also need to add the name attribute

### Getting the js object

To submit the form, we should NOT add a click listener to the submit button. Doing so will trigger standard form behavior (a submit event). Instead, we should put the ngSubmit event directly on the form. This event will be fired when we click submit

```html
<form (ngSubmit)="onSubmit(myform)" #myform="ngForm"></form>
```

```typescript
import { NgForm } from '@angular/forms';

  onSubmit(f:NgForm) {
    console.log(f);
  }
```

- Note: in the template, arg of on submit must have same name as template ref
- Note 2: the ="ngForm" tels angular to get the form js object
- The form object has a lot of properties. The values entered by the user are in the value attribute

### Another way to submit with ViewChild

```html
<form (ngSubmit)="onSubmit()" #myform="ngForm"></form>
```

```typescript
import { NgForm } from '@angular/forms';

@ViewChild('myform') myform: NgForm;
onSubmit() {
    console.log(this.myform);
}
```

Instead of passing myform to submit, we instead use the ref to get it via ViewChild
This is useful if we want to access the form before submit

## Reactive Approach

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
{{ server.started | date:'fullDate' }}
```

Note : if a pipe takes several parameters, you would do something like

```html
{{ myproperty | mypipe:'value1':'value2' }}
```

## Where to learn more

https://angular.io/api?type=pipe
for ex, the slice pipe :

```html
{{ value_expression | slice : start [ : end ] }}
```

## Chaining multiple pipes

```html
{{ server.started | date:'fullDate' | uppercase}}
```

Order is important (generally parsed from left to right)

## Creating a custom pipe :

- `shorten.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, nbCharacters: number = 10) {
    return value.substr(0, nbCharacters);
  }
}
```

in app.module.ts, add `ShortenPipe` in `declarations`
in component, use like this for default value

```html
{{ server.name | shorten }}
```

or like this to specify nb characters

```html
{{ server.name | shorten:4 }}
```

## Creating a filter pipe

Generate pipe with cli : ng g p

By default angular is not rerunning the pipe on the data whenever the data changes
To be precise, updating arrays or object does not trigger it
However it does run it again when the inputs of the pipe change.
If you want it to be triggered on any change in the page data :

```typescript
@Pipe({
  name: 'filter',
  pure: false,
})
```

However, it can lead to performance issues so be careful.
Ex of a filter pipe :

```typescript
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string): any {
    if (value.length === 0 || filterString === '') {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }
}
```

```html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <input type="text" [(ngModel)]="filteredStatus" />
      <br />
      <button class="btn btn-primary" (click)="onAddServer()">
        Add Server
      </button>
      <ul class="list-group">
        <li
          class="list-group-item"
          *ngFor="let server of servers | filter:filteredStatus:'status'"
          [ngClass]="getStatusClasses(server)"
        >
          <span class="badge"> {{ server.status }} </span>
          <strong>{{ server.name |shorten }}</strong> | {{ server.instanceType |
          uppercase }} | {{ server.started | date:'fullDate' | uppercase}}
        </li>
      </ul>
    </div>
  </div>
</div>
```

For pure pipes, if i add a server while the filter is on, i wont see it until I
change the input. For impure pipes, i will see it directly

## Async pipe

in my component:

```typescript
export class AppComponent {
  appStatus = new Promise((resolve, reject)=>{
	  setTimeout(()=>{
		  resolve("stable")
	  }, 2000)
  })
  ...
```

in html

```html
<h2>App status: {{ appStatus | async}}</h2>
```

the built in async pipe will recognize promises (and observables) and display the resulting value when the promise is finished

# Http requests

Dont store credentials in angular

## Create db service in firestore :

NOTE : this is not a database but a service. Angular should never communicated directly with a database

start in test mode
https://ng-complete-guide-f3876-default-rtdb.firebaseio.com/

## Sending post request

in app.module.ts

```typescript
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  ...
  imports: [..., HttpClientModule],
  ...
})
```

in component

```typescript
import { HttpClient } from '@angular/common/http';

....

constructor(private http: HttpClient) {}

onCreatePost(postData: { title: string; content: string }) {
// angular automatically converts our js object to json
  this.http.post(this.baseUrl + "/posts.json", postData).subscribe(
    (res) => {
      // no need to unsubscribe as it completes anyways after res is sent
      console.log(res);
    },
  );
}

```

http requests are observables. Which means we have to subscribe to a http request. If not, it means we are not interested in the response and angular does not even send the request

## Get requests

```typescript
private fetchPosts() {
  this.http.get(this.baseUrl + '/posts.json').subscribe((posts) => {
    console.log(posts);
  });
}
```

the data we get is a bit messy, we have to transform it !

## Using rxjs operators to transform response data

The data returned is in the form of nested object, so we use pipe to transform it.

```typescript
private fetchPosts() {
  this.http
  .get(this.baseUrl + '/posts.json')
  .pipe(
    map((responseData) => {
      const postArray = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postArray.push({ ...responseData[key], id: key });
        }
      }
      return postArray;
    })
  )
  .subscribe((posts) => {
    console.log(posts);
  });
}
```

## Types with http client

To get better autocompletion, you can do something like this :

```typescript
this.http
  .get(this.baseUrl + '/posts.json')
  .pipe(
    map((responseData: { [key: string]: Post }) => {
```

However, with http client, there is a more elegant way. Instead the get method is a so called generic method

```typescript
this.http
  .get<{ [key: string]: Post }>(this.baseUrl + '/posts.json')
  .pipe(
    map((responseData) => {
```

Note that this functionality is available for all http requests.
For post requests, what we put between <> is the format of the response not the request body. In our case :

```typescript
onCreatePost(postData: Post) {
  this.http.post<{name: string}>(...
```

## Using services

Best practice : in service do http request and transformation of data.
In component, subscribe to result

Service :

```typescript
fetchPosts() {
  return this.http
    .get<{ [key: string]: Post }>(this.baseUrl + '/posts.json')
    .pipe(
      map((responseData) => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      })
    )
}
```

Component :

```typescript
onFetchPosts() {
  this.isFetching = true;
  this.postsService.fetchPosts().subscribe((posts) => {
    this.loadedPosts = posts;
    this.isFetching = false;
  });
}
```

## Delete request

```typescript
clearPosts() {
  return this.http.delete(this.baseUrl + '/posts.json');
}
```

## Error handling

### Standard way

```typescript
onFetchPosts() {
  this.isFetching = true;
  this.postsService.fetchPosts().subscribe((posts) => {
    this.loadedPosts = posts;
    this.isFetching = false;
  }, error =>{
	this.isFetching = false;
	console.log(error)
  });
}
```

### With subject

useful if i dont subscribe in the component but in the service directly
In the service

```typescript
errorMessage = new Subject<string>();
...
createAndStorePost(title: string, content: string) {
  const postData: Post = {
    title: title,
    content: content,
  };
  this.http
    .post<{ name: string }>(this.baseUrl + '/posts.json', postData)
    .subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        this.errorMessage.next(error.message);
      }
    );
}
```

In the component, I subscribe to errorMessage

### catchError operator

```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
...
export class PostsService {

 ...

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(this.baseUrl + '/posts.json')
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          console.log('Sending to analytics');
          // pass the errorRes: it needs to reach subscribe
          return throwError(errorRes);
        })
      );
  }
```

## Setting headers

In the http request, we can add an options object (extra arg)

```typescript
import { HttpHeaders } from '@angular/common/http';

...
this.http.get<{ [key: string]: Post }>(this.baseUrl + '/posts.json',
{
  headers: new HttpHeaders({"Custom-Header": "Hello"})
})

```

import { HttpParams } from '@angular/common/http';

## Query params

```typescript
this.http.get<{ [key: string]: Post }>(this.baseUrl + '/posts.json', {
  headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
  params: new HttpParams()
    .set('print', 'pretty') // overwrites values
    .append('search', 'mystring'), // add a new value
});
```

## Observing different types of response.

Up until now, we only looked at the response body. But sometimes we need to look at the response headers or status for ex.
So instead of only the body, we can get the full response.
In the options object, i can add the `observe` key with :

- `'body'` gives the default response
- `'response'` gives the full response
- `'events'` outputs all the events

```typescript
this.http.post<{ name: string }>(this.baseUrl + '/posts.json', postData, {
  observe: 'response', // 'body' | 'events' | 'response' - 'body' by default
});
```

```typescript
import { tap } from 'rxjs/operators';
import {HttpEventType} from '@angular/common/http';

...

return this.http
  .delete(this.baseUrl + '/posts.json', {
    observe: 'events',
  })
  .pipe(
    tap((event) => {
	  if (event.type === HttpEventType.Response){
		  console.log(event.body);
	  }
	  // don't return anything, it does alter the dataflow
    })
  );
}
```

tap allows to execute some code without altering the response
HttpEventType is an enum :

- Sent = 0,
- UploadProgress = 1,
- ResponseHeader = 2,
- DownloadProgress = 3,
- Response = 4,
- User = 5

## Response type

By default angular expects json. But we can chage the responseType in the options, for ex

```typescript
{
  responseType: 'text'; // or 'json' or 'blob'
}
```

## Interceptor

### Providing the service

add some code each time a request leaves the app
An interceptor is a service but the way we provide it is a bit different than usual.

For ex : in the service :

```typescript
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request is on its way');
    return next.handle(req); // lets the request continue
  }
}
```

In app.module.ts

```typescript
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
...
@NgModule({
  ...
  providers: [
    {
      provide: HTTP_INTERCEPTORS, // special keyword
      useClass: AuthInterceptorService,
      multi: true, // allows multiple interceptors
    },
  ],
  ...
```

### Modify the request object inside the interceptor

The request object is immutable and therefore, inside the interceptor, we can not do `req.url = 'something'`
Instead, we call `request.clone` and pass a js object where we can overwrite all the core things
For ex :

```typescript
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request is on its way');
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz'),
    });
    return next.handle(modifiedRequest); // forwards the modified req
  }
}
```

### Response interceptor

In the interceptor, you can interact with the request as shown above.
You can also interact with the response :

```typescript
return next
      .handle(modifiedRequest) // observable
      .pipe(
        tap((event) => {
          // no matter which responsetype you chose,
          // in interceptors you always get an event
          console.log('event', event);
          if (event.type == HttpEventType.Response) {
            console.log('Response arrived');
            console.log(event.body);
          }
        })
      );
  }
```

## Multiple interceptors

in app.module

```typescript
providers: [
    {
      provide: HTTP_INTERCEPTORS, // special keyword
      useClass: AuthInterceptorService,
      multi: true, // allows multiple interceptors
    },
    {
      provide: HTTP_INTERCEPTORS, // special keyword
      useClass: LoggingInterceptorService,
      multi: true, // allows multiple interceptors
    },
  ],
```

Note : the order is important

# OTHER STUFF

## TODO

## TODO

## TODO

## TODO

# Unit Testing

We use jasmine to test angular
Just run `ng test` to launch the tests

## Testing app.component

```typescript
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: CompleteGuideFinalWebpack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    });
  });
  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));
});
```

First `TestBed` is used for the testing;
`beforeEach` is executed before each test (which are executed independently)
Instructions are pretty straightforward

## Testing a basic component

```html
<div *ngIf="isLoggedIn">
  <h1>User logged in</h1>
  <p>User is: {{ user.name }}</p>
</div>
<div *ngIf="!isLoggedIn">
  <h1>User not logged in</h1>
  <p>Please log in first</p>
</div>
```

```typescript
export class UserComponent implements OnInit {
  user: { name: string };
  isLoggedIn = false;
  constructor() {}
  ngOnInit() {}
}
```

Now lets test it

```typescript
describe('Component: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

Same idea as app.component here

## Testing dependencies: components and services

Lets create a service and provide it to the user component

```typescript
export class UserService {
  user = {
    name: 'Gab',
  };
}
```

In the user component

```typescript
constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.user;
  }
```

Now to test it, we need to get the username from the service

```typescript
it('should use the user name from the service', () => {
  const fixture = TestBed.createComponent(UserComponent);
  const app = fixture.debugElement.componentInstance;

  const userService = fixture.debugElement.injector.get(UserService);
  expect(userService.user.name).toEqual(app.user.name);
});
```

Here i get an error and the test fails: app.user is undefined. Indeed, we missed the lifecycle hooks that happen automatically in angular.
Indeed the user.name is set on ngOnInit;
Here we have to run them ourselves. To fix this:

```typescript
it('should use the user name from the service', () => {
    ...
    const userService = ...
	fixture.detectChanges();
	expect ...
  });
```

and now it works.
To test now what is displayed, i need to access the template

```typescript
it('should display the username if user is logged in', () => {
  const fixture = TestBed.createComponent(UserComponent);
  const app = fixture.debugElement.componentInstance;
  // no need to access the injected userService here because i dont want
  // to test it
  app.isLoggedIn = true; // modified the isLoggedIn attr
  fixture.detectChanges();
  let compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('p').textContent).toContain(app.user.name);
});
```

and of course

```typescript
it("shouldn't display the username if user is not logged in", () => {
    ...
    // no overwriting of isLoggedIn here
    expect(compiled.querySelector('p').textContent).not.toContain(
      app.user.name
    );
  });
```
