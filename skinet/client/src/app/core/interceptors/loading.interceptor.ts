import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (!request.url.includes('emailExists')) {
    //   this.busyService.busy(); //turn off full page loading spinner when we are checking if email exists on Sign Up page
    //   //as api will be called every time we enter chars in box 
    //   //and loading full page for every input is bad UX 
    // }
    if (request.url.includes('emailExists') || 
      request.method === 'POST' && request.url.includes('orders')
    ) {
      return next.handle(request);
      //no full page loader for submit order click
    }

    this.busyService.busy(); 

    return next.handle(request).pipe(
      delay(200),
      finalize(() => this.busyService.idle())
    )
  }
}