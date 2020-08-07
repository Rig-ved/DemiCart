import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { ShoppingCart } from 'services/shopping-cart.service';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnChanges {

  orders : Array<any>
  cart:ShoppingCart
  @Input('iterable') iterable
  @Input('cart') cartIpt
  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
        if (property === 'iterable') {
          this.orders = this.iterable
          this.cart = this.cartIpt
        } 
    }
}

}
