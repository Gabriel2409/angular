import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Logging');
    const modifiedRequest = req.clone({
      headers: req.headers.append('Logging', 'ok'),
    });
    return next.handle(modifiedRequest);
  }
}
