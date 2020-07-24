import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpParams
  } from "@angular/common/http";
  import { Observable } from "rxjs";
  import { tap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';

  @Injectable({
    providedIn:'root'
  })
  export class LoadingInterceptorService implements HttpInterceptor {
    private numberOfRequests = 0;
    constructor(
      private spinnerService : SpinnerService) {
  
      }
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ):Observable<HttpEvent<any>> {
      this.numberOfRequests++;
      this.spinnerService.showLoader();
      return next.handle(req).pipe(
        tap(
            (event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                this.onEnd();
              }
            },
            (err: any) => {
              this.onEnd();
            }
          )

      );
                 
        
       
    }
    private onEnd(): void {
      this.numberOfRequests--;
      if (this.numberOfRequests === 0) {
        //this.hideLoader();
        this.spinnerService.hideLoader();
      }
    }
  }
  