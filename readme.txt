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

