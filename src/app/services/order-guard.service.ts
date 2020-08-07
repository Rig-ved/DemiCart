import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';
import { map } from 'rxjs/operators';
import { CheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class OrderGuardService implements CanActivate {

  constructor(
    private checkoutServ:CheckoutService,
    private router:Router
  ) { }
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean  | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    return this.checkoutServ.getOrder().pipe(
      map((item)=>{
        if(item) return true
        this.router.navigate(['/'])
        return false
      })
    )
  }
}
