import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart.service';
import { OrderDeactivateService, DeactivationGuarded } from '../order-deactivate.service';
import { Subscription, Observable } from 'rxjs';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit,OnDestroy,OrderDeactivateService {
  orderSub: Subscription;
  cartSub: Subscription;
  confirmationSub:Subscription;
  order: any;
  constructor(
    private router:Router,
    private checkoutService:CheckoutService,
    private shoppingCartServ:ShoppingCartService
  ) { }
  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe()
    if(this.orderSub) this.orderSub.unsubscribe()
    if(this.confirmationSub) this.confirmationSub.unsubscribe()

  }
  canDeactivate() {
      this.orderSub=this.shoppingCartServ.removeOrder().subscribe()
      return true
  }

  ngOnInit(): void {
    this.confirmationSub = this.checkoutService.getConfirmOrder().subscribe((res:any)=>{
      for(var item in res) {
        this.order= res[item]
      }
      
    })
    this.cartSub= this.shoppingCartServ.clearCart().subscribe()
  }
  redirectToHome() {
    this.router.navigate(['']);
  }

}
