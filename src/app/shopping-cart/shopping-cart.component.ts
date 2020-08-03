import { Component, OnInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { ShoppingCartService, ShoppingCart } from '../shopping-cart.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit,OnDestroy {
  cartSub:Subscription
  cart:ShoppingCart
  constructor( private router:Router,
    @Inject(LOCALE_ID) private locale: string,
    private cartService:ShoppingCartService) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((res)=>{
      this.cart = res
    })
  }

  getTitle(item) {
    return formatCurrency(item.product.price,this.locale,getCurrencySymbol('USD', 'wide')) + " per Item"
  }

  redirectToHome() {
    this.router.navigate(['']);
  }
  ngOnDestroy () {
    if(this.cartSub) this.cartSub.unsubscribe()
  }
  checkout() {
    this.router.navigate(['/checkout'])
  }

}
