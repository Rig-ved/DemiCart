import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/admin/product-form/product-form.component';
import { ShoppingCartService } from 'src/app/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('item') item:Product
  @Input('showActions') showActions:boolean
  constructor(
    private shoppingCartService:ShoppingCartService
  ) { }
  ngOnInit(): void {

  }
  addToCart(product:Product) {
      this.shoppingCartService.addToCart(product)
  }
}
