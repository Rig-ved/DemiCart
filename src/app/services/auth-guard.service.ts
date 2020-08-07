import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, catchError, take, exhaustMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService:AuthService, private router:Router) { }
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean  | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    return this.authService.user$.pipe(
      map((user)=>{
        if(user) return true
        this.router.navigate(['/login'],{queryParams:{returnUrl:route.url}})
        return false
      })
    )
  }
}
