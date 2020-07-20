import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/admin/product-form/product-form.component';
import { ShoppingCartService, ShoppingCartItem } from 'src/app/shopping-cart.service';


export interface ShoppingCart {
    items:ShoppingCartItem
}


@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('item') item:Product
  @Input('showActions') showActions:boolean
  @Input('shoppingCart') shoppingCart:ShoppingCart

  constructor(
    private shoppingCartService:ShoppingCartService
  ) { }
  ngOnInit(): void {

  }
  addToCart() {
      this.shoppingCartService.addToCart(this.item)
  }

  removeFromCart() {
    this.shoppingCartService.removeFromCart(this.item)
  }

  getQuantity() {
    if(this.shoppingCart) {
        let productWithQty = this.shoppingCart[this.item.key] as ShoppingCartItem
        return productWithQty ?  productWithQty.quantity : 0

    }


  }
}
