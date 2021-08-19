import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LoggingInterceptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
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
  bootstrap: [AppComponent],
})
export class AppModule {}
