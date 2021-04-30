import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServerComponent} from './server/server.component';
import { ServersComponent } from './servers/servers.component'
import { WarningAlertComponent } from './warning-alert/warning-alert.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component'

@NgModule({
    declarations: [AppComponent, ServerComponent, ServersComponent, WarningAlertComponent, ErrorAlertComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
	title = "myapp";
}
