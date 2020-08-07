import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingGuardService implements CanActivate {

  constructor(
    private shoppingCartServ:ShoppingCartService,
    private router:Router
  ) { }
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean  | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    return this.shoppingCartServ.getCart().pipe(
      map((cart)=>{
        if(cart && cart.itemCount > 0) return true
        this.router.navigate(['/'])
        return false
      })
    )
  }
}
