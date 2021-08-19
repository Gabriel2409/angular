import {
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request is on its way');
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz'),
    });
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
}
