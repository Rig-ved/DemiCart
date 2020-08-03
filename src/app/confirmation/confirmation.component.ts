import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart.service';
import { OrderDeactivateService, DeactivationGuarded } from '../order-deactivate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit,OnDestroy,OrderDeactivateService {
  orderSub: Subscription;
  cartSub: Subscription;
  constructor(
    private router:Router,
    private shoppingCartServ:ShoppingCartService
  ) { }
  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe()
    if(this.orderSub) this.orderSub.unsubscribe()

  }
  canDeactivate() {
      this.orderSub=this.shoppingCartServ.removeOrder().subscribe()
      return true
  }

  ngOnInit(): void {
    this.cartSub= this.shoppingCartServ.clearCart().subscribe()
  }
  redirectToHome() {
    this.router.navigate(['']);
  }

}
